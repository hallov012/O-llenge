import * as React from "react"
import { BottomNavigation, configureFonts } from "react-native-paper"
import { View, StyleSheet, StatusBar, NativeModules } from "react-native"
import * as Font from "expo-font"
import AppLoading from "expo-app-loading"
import { useState, useEffect } from "react"

import StartScreen from "./screens/StartScreen"
import MyCGScreen from "./screens/MyCGScreen"
import RankingCGScreen from "./screens/RankingCGScreen"
import UserRankScreen from "./screens/UserRankScreen"
import MyPageScreen from "./screens/MyPageScreen"

import ColorSet from "./style/ColorSet"

const MyCGRoute = () => <MyCGScreen />

const RankingCGRoute = () => <RankingCGScreen />

const UserRankRoute = () => <UserRankScreen />

const MyPageRoute = () => <MyPageScreen />

const { StatusBarManager } = NativeModules

const App = () => {
  useEffect(() => {
    Platform.OS == "ios"
      ? StatusBarManager.getHeight((statusBarFrameData) => {
          setStatusBarHeight(statusBarFrameData.height)
        })
      : setStatusBarHeight(StatusBar.currentHeight)
  }, [])

  const [statusBarHeight, setStatusBarHeight] = useState(0)

  const [isReady, setIsReady] = useState(false)
  const getFonts = async () => {
    await Font.loadAsync({
      Recipekorea: require("./assets/fonts/Recipekorea.ttf"),
      HyeminRegular: require("./assets/fonts/HyeminRegular.ttf"),
      HyeminBold: require("./assets/fonts/HyeminBold.ttf"),
    })
  }

  const [index, setIndex] = React.useState(4)
  const [routes] = React.useState([
    {
      key: "myCG",
      title: "내 챌린지",
      focusedIcon: "home",
    },
    { key: "rankingCG", title: "랭킹 챌린지", focusedIcon: "fire" },
    { key: "userRank", title: "유저랭킹", focusedIcon: "crown" },
    {
      key: "myPage",
      title: "마이페이지",
      focusedIcon: "account",
    },
  ])

  const renderScene = BottomNavigation.SceneMap({
    myCG: MyCGRoute,
    rankingCG: RankingCGRoute,
    userRank: UserRankRoute,
    myPage: MyPageRoute,
  })

  function startScreenChange() {
    setIndex(0)
  }
  // index == 4인 경우 StartScreen 출력, 그 외엔 BottomNav랑 해당 스크린 출력
  return isReady ? (
    <View style={styles.rootScreen}>
      <View style={index == 4 ? { height: 0 } : { height: statusBarHeight }}></View>
      {index == 4 ? (
        <StartScreen startScreenChange={startScreenChange} />
      ) : (
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          compact={false}
          sceneAnimationType={"shifting"}
          barStyle={styles.bottomNavContainer}
          activeColor={`${ColorSet.orangeColor(1)}`}
          inactiveColor={`${ColorSet.navyColor(1)}`}
          theme={{
            fonts: {
              labelMedium: {
                fontFamily: "HyeminBold",
              },
            },
            colors: {
              onSurfaceVariant: `${ColorSet.navyColor(1)}`,
              onSurface: `${ColorSet.orangeColor(1)}`,
              secondaryContainer: "#FF999900",
            },
          }}
        />
      )}
    </View>
  ) : (
    <AppLoading startAsync={getFonts} onFinish={() => setIsReady(true)} onError={() => {}} />
  )
}

export default App

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
  bottomNavContainer: {
    backgroundColor: "white",
    borderTopColor: `${ColorSet.navyColor(1)}`,
    borderTopWidth: 1,
  },
})