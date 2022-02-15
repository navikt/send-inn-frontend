const Layout = ({ children }) => {
  return (
    <div className="content">
        this is in a layout
      { children }
      {/* footer could go here */}
    </div>
  );
}
 
export default Layout;