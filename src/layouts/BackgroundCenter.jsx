export default function BackgroundCenter(props) {
    return (
        <div className="d-flex justify-content-center align-items-center"
            style={
                {
                    height: "100vh",
                    width: "100vw",
                    backgroundColor: "var(--bs-light)",
                    overflowX: "hidden",
                    overflowY: "auto",
                }
            }>
            <div className="d-flex flex-column w-75 justify-content-center"
                style={{ height: "max-content", maxWidth: "400px", minWidth: "200px", margin: "auto" }}>
                <div className="d-flex justify-content-center w-100"
                    style={{ height: "130px" }}>
                    <img src={process.env.PUBLIC_URL + '/logo512.png'} alt="logo"
                        style={{ objectFit: "scale-down", width: "130px"}} />
                </div>
                <div className="d-flex w-100 justify-content-center"
                    style={{ height: "max-content" }}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}