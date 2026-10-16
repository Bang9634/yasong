# Java 21과 VS Code의 생성자 오류

프로젝트 빌드 대상은 Java 21입니다. `Flexible Constructor Bodies`는 생성자의 super()/this() 호출 전에 제한된 문장을 둘 수 있게 한 Java 25 기능입니다. 이 프로젝트의 명시적 생성자는 그 문법을 사용하지 않습니다.

2026-10-16 확인한 개발 환경은 Temurin 21, redhat.java 1.57.0, 확장에 포함된 Lombok lombok-1.18.39-4050.jar입니다. `@RequiredArgsConstructor` 등에서 Java 25를 요구하는 오류는 해당 Java 확장/JDT/ECJ와 Lombok 사이의 알려진 호환성 문제와 일치합니다. 실제 소스 빌드는 Java 21 javac로 clean compile하여 확인합니다.

- Oracle 기능 설명: https://docs.oracle.com/en/java/javase/25/language/flexible-constructor-bodies.html
- 공식 vscode-java 이슈: https://github.com/redhat-developer/vscode-java/issues/4521

현재 안정적인 우회 방법은 VS Code Extensions에서 `Language Support for Java(TM) by Red Hat`의 톱니바퀴 → Install Another Version → 1.56.0을 선택하고 창을 다시 로드하는 것입니다. CLI가 있다면:

```bash
code --install-extension redhat.java@1.56.0
```

해당 확장만 자동 업데이트를 잠시 끄고, 이후 호환성 수정이 포함된 릴리스가 확인되면 다시 업데이트합니다. 이슈에는 1.58 사전 릴리스에서 개선되었다는 보고도 있으나 정식 릴리스와 자신의 환경에서 검증이 필요합니다. 필요하면 명령 팔레트의 `Java: Clean Java Language Server Workspace` 후 다시 로드합니다.

pom의 Java 버전을 25로 올리거나 오류 표시만 숨기지 마세요. Java 언어 서버가 자체 실행에 쓰는 JRE와 프로젝트의 컴파일 대상 버전은 별개입니다. Maven Lombok 버전만 변경해도 확장에 포함된 Lombok까지 바뀌는 것은 아닙니다.

```bash
cd backend
./mvnw clean compile
```

빌드도 실패하거나 실제로 super()/this() 앞에 문장이 있다면 편집기 호환성 문제와 별도로 그 생성자 코드를 검토해야 합니다.
