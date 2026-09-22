/**
 *  Copyright (c) 2026 khrotu. Apache License 2.0.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

'use client'
import { useRef, useCallback, useEffect } from 'react'
export function useDragScroll(direction: 'x' | 'y' | 'both' = 'both') {
  const ref = useRef<HTMLDivElement>(null)
  const state = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  })
  const cursor = useRef<string>('')
  const frame = useRef(0)
  const velocity = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, time: 0 })
  const momentum = useCallback(() => {
    if (state.current.dragging) return
    const el = ref.current
    if (!el) return
    velocity.current.x *= 0.96
    velocity.current.y *= 0.96
    if (direction !== 'y') el.scrollLeft -= velocity.current.x
    if (direction !== 'x') el.scrollTop -= velocity.current.y
    if (Math.abs(velocity.current.x) < 0.5 && Math.abs(velocity.current.y) < 0.5) return
    frame.current = requestAnimationFrame(momentum)
  }, [direction])
  const onMouseDown = useCallback((e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    state.current.dragging = true
    state.current.startX = e.pageX - el.offsetLeft
    state.current.startY = e.pageY - el.offsetTop
    state.current.scrollLeft = el.scrollLeft
    state.current.scrollTop = el.scrollTop
    velocity.current = {
      x: 0,
      y: 0,
      lastX: e.pageX,
      lastY: e.pageY,
      time: performance.now(),
    }
    cursor.current = el.style.cursor
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
  }, [])
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current
      if (!el || !state.current.dragging) return
      e.preventDefault()
      const now = performance.now()
      const dt = now - velocity.current.time
      const dx = e.pageX - velocity.current.lastX
      const dy = e.pageY - velocity.current.lastY
      if (dt > 0) {
        velocity.current = {
          x: (dx / dt) * 10,
          y: (dy / dt) * 10,
          lastX: e.pageX,
          lastY: e.pageY,
          time: now,
        }
      }
      const x = e.pageX - el.offsetLeft
      const y = e.pageY - el.offsetTop
      if (direction !== 'y')
        el.scrollLeft = state.current.scrollLeft - (x - state.current.startX) * 1.5
      if (direction !== 'x')
        el.scrollTop = state.current.scrollTop - (y - state.current.startY) * 1.5
    },
    [direction],
  )
  const release = useCallback(() => {
    const el = ref.current
    if (!el) return
    state.current.dragging = false
    el.style.cursor = cursor.current
    el.style.userSelect = ''
    frame.current = requestAnimationFrame(momentum)
  }, [momentum])
  const onMouseUp = useCallback(() => {
    if (!state.current.dragging) return
    release()
  }, [release])
  const onMouseLeave = useCallback(() => {
    if (!state.current.dragging) return
    release()
  }, [release])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mouseleave', onMouseLeave)
    return () => {
      cancelAnimationFrame(frame.current)
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [onMouseDown, onMouseMove, onMouseUp, onMouseLeave])
  return ref
}