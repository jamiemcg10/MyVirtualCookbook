'use client'

export default function Error() {
  return (
    <div className="flex flex-col space-y-8 items-center mt-24 text-2xl">
      <div className="text-mvc-white">Looks like this page doesn't exist</div>
      <img src="/searching-svgrepo-com.svg" height={250} width={250}></img>
    </div>
  )
}
