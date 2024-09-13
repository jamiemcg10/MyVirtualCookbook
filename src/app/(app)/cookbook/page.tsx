'use client'

import React, { useEffect } from 'react'

export default function Cookbook() {
  useEffect(() => {
    window.history.replaceState(null, '', '/cookbook')
  }, [])
  return <div>Cookbook page</div>
}
