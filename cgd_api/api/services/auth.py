from passlib.context import CryptContext
from jose import (jwt, JWTError)
from datetime import (
    datetime,
    timedelta,
)
from fastapi import (
    Depends,
    status,
    HTTPException
)
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
)

from api.schemas.user import RequestUser, ShowUser
from api.schemas.auth import Token
from api.repository.user import UserRepository
from api.config import Config
from api.exceptions import raise_with_log

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=Config.TOKEN_URL, auto_error=False)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> ShowUser | None:
    if token is None:
        raise_with_log(status_code=status.HTTP_401_UNAUTHORIZED,
                       detail="Invalid token")

    try:
        payload = jwt.decode(token, Config.TOKEN_KEY, algorithms=["HS256"])

        if payload is None:
            raise_with_log(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        name: str = payload.get("name")
        sub: str = payload.get("sub")
        expires_at: str = payload.get("expires_at")

        if sub is None:
            raise_with_log(status_code=status.HTTP_401_UNAUTHORIZED,
                           detail="Invalid credentials")

        if is_expired(expires_at):
            raise_with_log(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")

        return ShowUser(name=name, username=sub)
    except JWTError:
        raise_with_log(status_code=status.HTTP_401_UNAUTHORIZED,
                       detail="Invalid Credentials")
    return None


def is_expired(expires_at: str) -> bool:
    return datetime.strptime(expires_at, "%Y-%m-%d %H:%M:%S") < datetime.utcnow()


class Hashing:
    @staticmethod
    def bcrypt(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify(hash_password: str, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, hash_password)


class AuthService(Hashing, UserRepository):
    async def create_user(self, request: RequestUser) -> None:
        request.password = self.bcrypt(request.password)

        return await self.create(request)

    async def authenticate(
        self, login: OAuth2PasswordRequestForm = Depends()
    ) -> Token | None:
        user = await self.get(login.username)

        if user.password is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"用户名或密码错误"
            )
        else:
            if not self.verify(user.password, login.password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail="密码错误"
                )
            else:
                access_token = self._create_access_token(
                    user.name, user.username
                )
                return Token(
                    access_token=access_token, token_type="bearer"
                )

    def _create_access_token(self, name: str, email: str) -> str:
        payload = {
            "name": name,
            "sub": email,
            "expires_at": self._expiration_time(),
        }

        return jwt.encode(payload, Config.TOKEN_KEY, algorithm="HS256")

    @staticmethod
    def _expiration_time() -> str:
        expires_at = datetime.utcnow() + timedelta(minutes=60)
        return expires_at.strftime("%Y-%m-%d %H:%M:%S")
