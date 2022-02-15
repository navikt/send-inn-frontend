const Layout = ({ children }) => {
  return (
    <div className="content">

       <h1 Style="background-color:blue;color:blue"> 0 </h1>
      { children }
      {/* footer could go here */}
      <h1 Style="background-color:blue;color:blue"> 1  </h1>
    </div>
  );
}
 
export default Layout;