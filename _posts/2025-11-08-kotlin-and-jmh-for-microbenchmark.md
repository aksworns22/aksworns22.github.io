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

## 마이크로 벤치마킹과 JMH


Microbenchmarking(마이크로 벤치마킹)이란 커다란 시스템에서 작은 부분의 성능을 측정하는 것을 말합니다.
[원문](https://stackoverflow.com/questions/2842695/what-is-microbenchmarking)에서는 운영체제에서 시스템 콜의 성능을 측정하는 것을 예시로 들어 설명합니다.

코틀린에서 마이크로벤치마킹을 하기 위해서 **JMH(Java Microbenchmark Harness)**를 사용합니다.
하네스(Harness)라는 용어가 낯설어 찾아보니 [Test Harness](https://stackoverflow.com/questions/11625351/what-is-test-harness "Test Harness") 를 찾을 수 있었습니다.
Test Harness는 테스트 라이브러리를 사용하여 테스트를 실행하고 결과 보고서를 생성하는 모든 작업을 가능하게 하는 것(enabler)입니다.
즉 **JMH는 복잡한 성능 측정 과정을 편리하게 관리해주는 툴**이라고 생각해볼 수 있었습니다.

## JMH 사용을 위한 Gradle 환경 설정

[JMH를 사용하기 위해 권장되는 방식](https://github.com/openjdk/jmh?tab=readme-ov-file#basic-considerations)은 Maven을 사용하는 것입니다.
하지만 Gradle도 커뮤니티에서 지원하는 플러그인을 통해 사용할 수 있습니다.
아래 코드는 [jmh-gradle-plugin](https://github.com/melix/jmh-gradle-plugin)을 사용하는 Gradle 설정입니다.

```gradle
plugins {
    id("me.champeau.jmh") version "0.7.3"
}
```

해당 플러그인은 기본적으로 JMH 1.37을 사용하며 JMH 버전을 올리고 싶다면 `dependencies`에 직접 설정을 해 줄 수 있습니다.
아래 코드는 jmh-gradle-plugin에 소개된 예시 코드입니다.

```gradle
dependencies {
    jmh 'org.openjdk.jmh:jmh-core:0.9'
    jmh 'org.openjdk.jmh:jmh-generator-annprocess:0.9'
    jmh 'org.openjdk.jmh:jmh-generator-bytecode:0.9'
}
```

추가적인 설정 없이 플러그인만 사용한 경우 공식 설명과 달리 JMH의 버전이 1.36임을 확인할 수 있었습니다.
사용하실 때 확인을 해보시면 좋을 것 같습니다.

![jmh-version]({{ site.url }}{{ site.baseurl }}/assets/images/posts/2025-11-08/jmh-version.png)

## 간단한 벤치마크 만들기

Gradle에서 JMH를 사용하기 위해 `src/jmh/kotlin` 경로에 벤치마크 코드를 작성했습니다.
JMH는 default 패키지를 지원하지 않으므로 benchmark 패키지를 새로 생성하여 파일을 위치시켰습니다.
작성한 간단한 벤치마크 코드는 다음과 같습니다.
JMH 벤치마크 클래스는 상속이 가능해야 하므로 `open` 키워드를 사용하지 않으면 `Benchmark classes should not be final` 오류가 발생합니다.

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

환경에 따라 다르겠지만 위 코드의 경우 결과를 얻기까지 약 8분이 소요되었습니다. 결과는 아래와 같습니다.

![basic-benchmark]({{ site.url }}{{ site.baseurl }}/assets/images/posts/2025-11-08/basic-benchmark.png)


## 벤치마크의 종류

JMH는 처리율(Throughput), 평균 시간(AverageTime) 등 다양한 벤치마크 모드를 지원합니다. 측정할 값은 **@BenchmarkMode** 어노테이션으로 설정할 수 있으며 아래는 평균 시간을 측정하는 코드 예시입니다.

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

Mode 값이 이전 thrpt와 달리 **avgt**가 되었음을 확인해볼 수 있습니다.

![avgt-benchmark]({{ site.url }}{{ site.baseurl }}/assets/images/posts/2025-11-08/avgt-benchmark.png)



## 벤치마크의 실행 방식

`@Fork` 어노테이션을 통해 벤치마크의 실행 방식을 설정할 수 있습니다. 해당 어노테이션은 value와 warmup 파라미터를 가집니다.

-   `value`: 벤치마크가 실행될 횟수
-   `warmup`: 결과 수집 전 수행할 dry run(practice run) 횟수로 벤치마크 결과에 반영되지 않습니다.

warm up 과정이 왜 필요한 지에 대해서는 자세히 조사해보지 못했지만 기본적으로 warm up을 통해 벤치마크의 일관성을 높일 수 있다고 합니다.
`@Fork` 어노테이션은 기본적으로 1번의 횟수는 5번의 반복을 가집니다.
상세한 설정을 위해서는 `@Measurement`를 통해 벤치마크 실행 횟수를 상세히 조절할 수 있고 `@Warmup`을 통해 마찬가지로 상세한 설정이 가능합니다.

아래 코드는 간단하게 `@Fork` 어노테이션을 활용하는 예시입니다.

실행 모습을 관찰해본 결과 웜업은 `fork`에 대한 웜업과 `value`에 대한 웜업이 실행됩니다.

포크에 대한 웜업은 `fork`를 통해 설정되며.. `Measurement` 횟수와 `Warmup` 횟수를 포함합니다. 실 측정에 대한 포크 횟수는 `value`를 통해서 측정 fork에 대한 설정은 Measurement와 warmup을 통해서

-   **포크 웜업 (Fork Warmup)**: `@Fork(warmups=N)`으로 설정하며, 전체 JVM 프로세스를 N번 실행했다가 종료하는 과정입니다. 각 웜업 포크는 실제 측정 포크와 동일하게 내부 이터레이션 웜업과 측정을 모두 수행하지만, 그 결과는 최종 통계에서 제외됩니다.
-   **이터레이션 웜업 (Iteration Warmup)**: `@Warmup(iterations=N)`으로 설정하며, 각 포크(프로세스) 내부에서 실제 측정 전 N번 반복 실행하는 과정입니다. 

n번 시간동안 랜덤한 횟수만큼 실행된다!

operation은 @Benchmark 메서드 

[https://stackoverflow.com/questions/29284076/what-does-operation-mean-in-jmh](https://stackoverflow.com/questions/29284076/what-does-operation-mean-in-jmh)

## State

State는 벤치마크가 실행되는 동안 특정 상태를 유지하는 데 사용됩니다.

## Blackhole

## 메모리 할당에 대한 벤치마크 방법

```gradle
jmh {
    profilers = listOf("gc")
}
```

## 예시: 삽입 정렬에 대한 벤치마크

```kotlin
fun insertionSort(arr: MutableList<Int>): MutableList<Int> {
    for (i in 1 until arr.size) {
        val key = arr[i]
        var j = i - 1
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]
            j -= 1
        }
        arr[j + 1] = key
    }
    return arr
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
