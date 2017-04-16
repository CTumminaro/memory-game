import React from 'react';

const Header = (props) => {
  return(
    <header id="header">
      <div className="container">
        <div className="logo">
          <img src="/images/peppa-pig/logo.png" alt="Peppa Pig Matching!" />
        </div>
        <div className="attempts">
          Attempts: {props.attempts}
        </div>
      </div>
    </header>
  )
}

export default Header;
