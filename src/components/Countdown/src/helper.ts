import { Fn } from "@vueuse/core"

interface TimeData {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

/**
 * 位数不足补0
 * @param num 需要补0的字符
 * @param len 全部的位数
 * @param after 是否在后面补0，默认在前面补0
 * @returns
 */
function padZero(num: number | string, len: number = 2, after = false): string {
  const str = num.toString()
  const pad = len > str.length ? "0".repeat(len - str.length) : ""
  return after ? str + pad : pad + str
}

/**
 * 转换时间对象
 * @param time 需要转换的时间，单位毫秒
 * @returns
 */
function parseTimeData(time: number | string): TimeData {
  time = +time
  const SECOND = 1000 // 秒
  const MINUTE = 60 * SECOND // 分钟
  const HOUR = 60 * MINUTE // 小时
  const DAY = 24 * HOUR // 天

  const days = Math.floor(time / DAY)
  const hours = Math.floor((time % DAY) / HOUR)
  const minutes = Math.floor((time % HOUR) / MINUTE)
  const seconds = Math.floor((time % MINUTE) / SECOND)
  const milliseconds = Math.floor(time % SECOND)

  return {
    days,
    hours: ~~(Array(2).join("0") + hours).slice(-2),
    minutes: ~~(Array(2).join("0") + minutes).slice(-2),
    seconds: ~~(Array(2).join("0") + seconds).slice(-2),
    milliseconds,
  }
}

/**
 * 格式化时间
 * @param format 时间格式，如：HH:mm:ss:SSS
 * @param timeData 时间对象
 * @returns
 */
function parseFormat(format: string, timeData: TimeData): string {
  const days = timeData.days
  let { hours, minutes, seconds, milliseconds } = timeData

  if (format.includes("DD")) {
    format = format.replace("DD", padZero(days))
  } else {
    hours += days * 24
  }

  if (format.includes("HH")) {
    format = format.replace("HH", padZero(hours))
  } else {
    minutes += hours * 60
  }

  if (format.includes("mm")) {
    format = format.replace("mm", padZero(minutes))
  } else {
    seconds += minutes * 60
  }

  if (format.includes("ss")) {
    format = format.replace("ss", padZero(seconds))
  } else {
    milliseconds += seconds * 1000
  }

  return format.replace("SSS", padZero(milliseconds, 3))
}

/**
 * 判断两个时间是否相同
 * @param time1
 * @param time2
 * @returns
 */
function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000)
}

/**
 * 创建一个简单的定时器
 * @param fn 
 * @returns 
 */
function _simpleTick(fn: Fn) {
  return setTimeout(fn, 30)
}
