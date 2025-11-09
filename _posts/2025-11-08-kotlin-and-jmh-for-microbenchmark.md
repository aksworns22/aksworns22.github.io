---
layout: single
title: "코틀린과 JMH를 활용한 마이크로 벤치마킹"
date: 2025-11-08
categories: [kotlin, benchmark]
tags: [kotlin, gradle, jmh]
toc: true
toc_sticky: true
author_profile: true
classes: wide
---

> 성능 측정을 위해 코틀린과 JMH를 사용하면서 배운 내용을 정리했습니다.

## 마이크로 벤치마킹과 JMH

Microbenchmarking(마이크로 벤치마킹)이란 커다란 시스템에서 작은 부분의 성능을 측정하는 것을 말합니다.
[참고했던 글](https://stackoverflow.com/questions/2842695/what-is-microbenchmarking)에서는 운영체제에서 시스템 콜의 성능을 측정하는 것을 예시로 들어 설명합니다.

코틀린에서 마이크로벤치마킹 혹은 성능 분석을 위해서 **JMH(Java Microbenchmark Harness)**를 사용할 수 있습니다.
하네스(Harness)라는 용어가 낯설어 찾아보니 [Test Harness](https://stackoverflow.com/questions/11625351/what-is-test-harness "Test Harness") 를 찾을 수 있었습니다.
Test Harness는 테스트 라이브러리를 사용하여 테스트를 실행하고 결과 보고서를 생성하는 모든 작업을 가능하게 하는 것(enabler)이라고 합니다.
결론적으로 **JMH는 복잡한 성능 측정 과정을 편리하게 관리해주는 툴**이라고 생각해볼 수 있었습니다.

## JMH 사용을 위한 Gradle 환경 설정

[JMH를 사용하기 위해 권장되는 방식](https://github.com/openjdk/jmh?tab=readme-ov-file#basic-considerations)은 Maven을 사용하는 것입니다.
하지만 Gradle도 커뮤니티에서 지원하는 플러그인을 통해 사용할 수 있습니다.
아래 코드는 [jmh-gradle-plugin](https://github.com/melix/jmh-gradle-plugin)을 사용하는 설정입니다.

```gradle
plugins {
    id("me.champeau.jmh") version "0.7.3"
}
```

해당 플러그인은 기본적으로 JMH 1.37을 사용하며 JMH 버전을 올리고 싶다면 `dependencies`에 직접 설정을 해 줄 수 있습니다.
아래 코드는 [jmh-gradle-plugin](https://github.com/melix/jmh-gradle-plugin)에 소개된 예시 코드입니다.

```gradle
dependencies {
    jmh 'org.openjdk.jmh:jmh-core:0.9'
    jmh 'org.openjdk.jmh:jmh-generator-annprocess:0.9'
    jmh 'org.openjdk.jmh:jmh-generator-bytecode:0.9'
}
```

추가적인 설정 없이 플러그인만 사용한 경우 공식 설명과 달리 JMH의 버전이 1.36임을 확인할 수 있었습니다.
사용하실 때 확인을 해보면 좋을 것 같습니다.

![jmh-version]({{ site.url }}{{ site.baseurl }}/assets/images/posts/2025-11-08/jmh-version.png)

## 간단한 벤치마크 만들기

Gradle에서 JMH를 사용하기 위해 `src/jmh/kotlin` 경로에 벤치마크 코드를 작성했습니다.
JMH는 default 패키지를 지원하지 않으므로 패키지를 새로 생성하여 파일을 위치시켰습니다.
작성한 간단한 벤치마크 코드는 다음과 같습니다.
JMH 벤치마크 클래스는 `open` 키워드를 사용하지 않으면 `Benchmark classes should not be final` 오류가 발생합니다.

```kotlin
package benchmark

import org.openjdk.jmh.annotations.Benchmark

open class Benchmark {
    @Benchmark
    fun init() {
        // Do Nothing
    }
}
```

벤치마크는 다음 명령어로 실행할 수 있습니다.

```bash
./gradlew jmh
```

결과는 다음과 같으며 6가지의 항목으로 이루어집니다.

![basic-benchmark]({{ site.url }}{{ site.baseurl }}/assets/images/posts/2025-11-08/basic-benchmark.png)

- `Benchmark`: 벤치마크의 이름을 나타냅니다
- `Mode`: 벤치마크 모드를 나타내며 `thrpt`는 처리율(Throughtput)입니다
- `Cnt`: 측정을 위해 실행한 횟수를 의미합니다
- `Score`: 성능 결과를 나타냅니다
- `Error`: 결과에 대한 오차를 나타냅니다
- `Units`: 측정 단위를 나타냅니다

## 벤치마크 모드

JMH는 5가지의 벤치마크 모드를 지원합니다. 측정할 값은 `@BenchmarkMode` 어노테이션으로 설정할 수 있습니다. [Operation](https://stackoverflow.com/questions/29284076/what-does-operation-mean-in-jmh)이란 `@Benchmark`메서드의 호출을 의미합니다.
- 처리율(Throughput)
- 평균 시간(Average Time) 
- 샘플 시간(Sample Time): operation에 대한 시간을 샘플링합니다.
- 단일 실행 시간(Single Shot Time): 한 번의 Operation의 수행 시간을 측정합니다
- 전체(All): 모든 벤치마크 모드를 수행합니다

다음 코드는 평균 시간을 측정하는 간단한 벤치마크 코드입니다.

```kotlin
package benchmark

import org.openjdk.jmh.annotations.Benchmark
import org.openjdk.jmh.annotations.BenchmarkMode
import org.openjdk.jmh.annotations.Mode

open class Benchmark {
    @Benchmark
    @BenchmarkMode(Mode.AverageTime)
    fun init() {
        // Do Nothing
    }
}
```

`Mode` 값이 이전 `thrpt`와 달리 `avgt`가 되었음을 확인해볼 수 있습니다.

![avgt-benchmark]({{ site.url }}{{ site.baseurl }}/assets/images/posts/2025-11-08/avgt-benchmark.png)

## Fork와 Iteration

[포크는 벤치마크가 수행하는 하위 프로세스입니다.](https://thebackendguy.com/posts/performance-analysis-using-jmh/#forks-and-iterations) 포크는 두 종류의 Iteration으로 구성됩니다. Iteration은 한 번의 반복이 아닌 정해진 시간동안 지속적으로 `@Benchmark` 메서드를 수행합니다.

- Warmup Iteration: JVM이 최적화하도록 한 후 결과는 버려집니다
- Measurement Iteration: 실제 결과에 반영되는 측정입니다

포크 또한 Warmup과 Measurement로 나뉘어 수행되며 자세한 설정은 `@Fork` 어노테이션을 활용해 변경가능합니다.

Warmup은 기본적으로 벤치마크의 일관성을 높이기 위해 사용한다고 합니다.


## State

벤치마크 실행 중 특정 상태를 유지해야 할 때 `@State` 어노테이션을 사용합니다. 이 어노테이션을 클래스에 적용하면 해당하는 상태 객체가 벤치마크 실행 동안 상태를 유지하게 됩니다.

### Default State

### @Setup과 @TearDown

### Param

## Batch Size

## Blackhole과 Dead Code Elimination

[빈 함수에 대한 벤치마크를 기준점으로 항상 사용하는 것을 추천한다고 합니다.](https://thebackendguy.com/posts/performance-analysis-using-jmh/#blackholes) 왜냐하면 빈 함수와 성능이 비슷하게 나온다면 JVM의 최적화를 의심할 수 있기 때문입니다.

## 메모리 할당에 대한 벤치마크 방법

```gradle
jmh {
    profilers = listOf("gc")
}
```

## JMH 결과를 시각화하는 방법
JMH를 통한 벤치마크 결과를 시각화 하는 다양한 웹사이트가 있습니다.
개인적으로 해당 [사이트](https://jmh.morethan.io/) 가 좋은 것 같습니다.
아래 이미지는 결과 파일을 파탕으로 생성된 결과입니다.

![vis-benchmark]({{ site.url }}{{ site.baseurl }}/assets/images/posts/2025-11-08/vis-benchmark.png)


### JSON 타입으로 결과 저장하기
여러 사이트들의 시각화 기능을 사용하기 위해서는 출력 결과를 `json` 타입으로 저장해야 합니다.
기본적으로 JMH는 txt 형태로 저장하기에 `build.gradle.kts`파일에 관련 설정을 해야 합니다.

```gradle
jmh {
    resultFormat = "json"
}
```

## 학습 및 참고한 글

-   [https://www.baeldung.com/java-microbenchmark-harness#bd-types](https://www.baeldung.com/java-microbenchmark-harness#bd-types)
-   [https://thebackendguy.com/posts/performance-analysis-using-jmh/#state](https://thebackendguy.com/posts/performance-analysis-using-jmh/#state)
-   [https://relentlesscoding.com/posts/benchmark-kotlin-with-jmh/](https://relentlesscoding.com/posts/benchmark-kotlin-with-jmh/)
