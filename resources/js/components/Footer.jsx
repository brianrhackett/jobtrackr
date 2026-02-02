export default function Footer() {
  return (
    <footer className="border-top py-3 mt-auto">
      <div className="container text-center text-muted">
        <small>© {new Date().getFullYear()} JobTrackr</small>
      </div>
    </footer>
  );
}