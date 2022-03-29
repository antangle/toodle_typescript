# first project with typeorm

제가 처음 만든 서버의 코드들을 한번 뜯어보니 정말 다양하게 문제들을 볼 수 있었습니다. 이번 프로젝트는 그 문제들을 몇개 해결하고자 짜보는 개인 프로젝트입니다.

# 개선점

# 1. 무분별한 try / catch 구문 해결
모든 api가 try, catch를 사용하며 간단한 코드도 가독성이 좋지 않았다. 따라서 이번에는 try catch를 최소한으로 써서 구조를 짜보기로 하였다.

```typescript
export const errCatcher = (fn: MiddlewareInput) => (req: Request, res: Response, next: NextFunction) => { 
    return Promise.resolve(fn(req, res, next)).catch(next);
}
```

이 코드는 미들웨어 함수를 Promise로 감싸고, 그것을 resolve할 시 에러가 나온다면 catch문에서 받고 globalErrorHandler에게 넘겨주는 역할을 한다.
미들웨어 함수들은 import 하기 전 errCatcher로 감싸주면 try catch문 필요없이 모든 에러들을 원하는대로 handling하는것이 가능하다.

# 2. CustomError 와 에러코드 체계 확립
이전의 api는 각각 try / catch 문의 catch단계에서 직접 -2022번 에러를 명시하는 식으로 구성했었다.
이것은 api문서를 작성할때도 모든 에러를 손수 정의해야 했기 때문에 일관성도 부족하고 직관성도 떨어졌다.

이번에는 코드 api의 위치(pos)를 미들웨어에서 세팅하고 그것을 req.pos에 담아 next()를 호출한다.
예를 들어 101번 api에서 1번에러(input이 잘못 들어옴)가 들어오면 에러핸들러는 자연스럽게 1011 에러 코드를 작성한다.

이러함으로써 얻는 이득은 어디에서 에러가 나더라도 errorHandler가 그 pos를 알 수 있다.
즉, 어떤 api를 콜했는지, 어떤 종류의 에러인지 한눈에 보인다.

# 3. consts
일부 변수들과 string들을 하드코딩한 전과 달리, 더 가독성도 높고 수정도 편한 consts를 선언하여 상수들을 관리했다.

# 4. orm의 사용
모든 쿼리를 직접 raw sql로 짯던 전과 달리 orm이라는 신기술을 써보기로 하였다.
sequalize와 typeorm의 선택지 중, typescript와 좀더 호환성이 높고, typescript가 징징대며 귀찮게할 변수들이 sequalize가 더 많다는 말을 보고 typeorm을 선정했다.

# 5. OOP와 DI의 활용
Controller, Service, Repository의 구조를 따라 코드를 짰으며, class를 만들고 각 controller들에 service를 의존성 주입하여 각각의 종속성을 낮추었다.

Repository: 순수한 db쿼리 하나를 담당.
Service: db쿼리 여러개를 날리거나 약간의 서비스 로직을 넣는 등의 부분적인 기능을 담당한다. 쿼리 함수에 들어가기전 파싱 등도 담당
Controller: service들을 조합해서 완성된 서비스 로직을 담당한다.

DI를 spring마냥 Bean으로 등록하는 것이 얼마나 편한건지 깨달았다... spring 혼자 공부했을땐 뭔지도 이해를 못했지만...

->todo: index에서 DI될 객체들을 미리 선언해야하는 불편함이 있다. DI툴같은게 있나?

# 현재 구현한 기능
1. 로컬 로그인
2. 카카오 Oauth2 로그인
3. 결제모듈 iamport 연동
4. 에러 헨들러
5. 데이터베이스 CRUD 및 relation

todo: 인덱싱, DI관련 좀더 공부? 소켓 프로그래밍, 로깅