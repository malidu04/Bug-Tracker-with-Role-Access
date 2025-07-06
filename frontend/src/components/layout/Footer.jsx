const Footer = () => {
  return (
    <footer className="bg-gray-50 py-6">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} BugTracker. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer