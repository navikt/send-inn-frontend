// TODO fix: Binding element 'children' implicitly has an 'any' type.ts(7031)
const Layout = ({ children }) => {
    return (
        <div className="content">
            <h1> header</h1>
            <div>
                {children}
                {/* footer could go here */}
            </div>
            <h1> footer</h1>
            <style jsx>{`
                .content {
                    font-size: 1.5em;
                    text-align: center;
                    font-family: arial;
                    line-height: 1.5;
                    max-width: 900px;
                }
            `}</style>
        </div>
    );
};

export default Layout;
