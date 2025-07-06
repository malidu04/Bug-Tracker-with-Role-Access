import { useState } from 'react'

const CommentForm = ({ onSubmit, loading }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ text })
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div>
        <label htmlFor="comment" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Add a comment..."
          required
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}

export default CommentForm