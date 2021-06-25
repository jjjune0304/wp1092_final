import React from 'react'
import SocialLogin from 'react-social-login'
import { Button } from 'antd'; 

class SocialButton extends React.Component {

    render() {
      const { children, triggerLogin, ...props } = this.props
      // console.log(this.props);
      return (
          <Button block type="dashed" onClick={triggerLogin} {...props} size="large">
            {children}
          </Button>
      );
    }
}

export default SocialLogin(SocialButton);