import React from "react"

import { createContext, useState } from "react"
import { AuthorizationInstance } from "../src/api/settings"

const instance = AuthorizationInstance()

export const RoomContext = createContext({
  roomInfo: new Object(),
  userList: new Array(),
  isAuthed: false,
  isResist: false,
  authImage: "",
  getRoomInfo: (challengeId) => {},
  getUserList: (challengeId) => {},
  getTodayAuth: (challengeId) => {},
  getImgResist: (challengeId) => {},
  resetRoomData: () => {},
})

function RoomContextProvider({ children }) {
  const [info, setCGinfo] = useState(new Object())
  const [user, setUser] = useState(new Array())
  const [auth, setAuth] = useState(false)
  const [resist, setResist] = useState(false)
  const [img, setImg] = useState()

  function getRoom(challengeId) {
    instance
      .get(`/api/challenge/${challengeId}`)
      .then((res) => {
        setCGinfo(res.data.challengeInfoList)
        getAuth(challengeId)
        getResist(challengeId)
      })
      .catch((err) => {
        console.log(err)
        setCGinfo(new Object())
      })
  }

  function getUser(challengeId) {
    instance
      .get(`/api/challenge/state/${challengeId}`)
      .then((res) => {
        const userState = res.data.challengeStateList
        setUser(userState)
      })
      .catch((err) => {
        console.log(err)
        setUser(new Array())
      })
  }

  const getAuth = function (challengeId) {
    instance
      .get(`/auth/isauthtoday/${challengeId}`)
      .then((res) => setAuth(res.data.isauthed))
      .catch((err) => console.log(err))
  }

  const getResist = function (challengeId) {
    instance
      .get(`/auth/isstdimg/${challengeId}`)
      .then((res) => {
        setResist(res.data.isauthed)
        setImg(res.data.stdimg)
      })
      .catch((err) => console.log(err))
  }

  const resetRoom = function () {
    setCGinfo(new Object())
    setUser(new Array())
  }

  const value = {
    roomInfo: info,
    userList: user,
    isAuthed: auth,
    isResist: resist,
    authImage: img,
    getRoomInfo: getRoom,
    getUserList: getUser,
    getTodayAuth: getAuth,
    getImgResist: getResist,
    resetRoomData: resetRoom,
  }

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}

export default RoomContextProvider
