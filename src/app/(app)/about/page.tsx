export default function About() {
  return (
    <>
      <div className="px-5">
        <h1 className="page-title">How it works</h1>
        <ol className="px-5 text-white list-decimal flex flex-col space-y-4">
          <li>
            Sign up for an account. You can create an account using your email address or using your
            Gmail account
          </li>
          <li>
            Add recipes to your chapters in your virtual cookbook. You can create as many chapters
            as you need and re-name them whenever you want
          </li>
          <li>
            You can drag and drop recipes from one chapter to another. It’s your cookbook! You can
            decide how your recipes will be organized
          </li>
          <li>
            Each recipe has its own notes. You can add notes on what works, what doesn’t work, what
            you changed, or whatever you want!
          </li>
        </ol>
      </div>
    </>
  )
}
