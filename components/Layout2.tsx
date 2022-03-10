import styled from 'styled-components'; 

const Content = styled.div`
font-size: 1.5em;
  text-align: center;
  font-family: arial;
  line-height: 1.5;
  max-width: 900px;
  
`;

const Layout = ({ children }) => {


  // hello world

  return (
<div className="content">

<h1 Style="background-color:grey;color:grey"> 0 </h1>
       <Content>
{ children }
      {/* footer could go here */}
      </Content>
      <h1 Style="background-color:grey;color:grey"> 1  </h1>
</div>
  );
}
 
export default Layout2;