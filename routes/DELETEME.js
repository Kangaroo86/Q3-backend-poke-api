import React, { Component } from 'react';
import { Button, Form, Segment, Grid, Header, Image } from 'semantic-ui-react';
import pokeball2 from '../images/pokeball2.png';
import ReactAudioPlayer from 'react-audio-player';

export default class SignUpComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      password: ''
    };
  }

  handle_selectedName = data => {
    this.setState(this.setState({ name: data.target.value }));
  };

  handle_selectedPassword = data => {
    this.setState(this.setState({ password: data.target.value }));
  };

  validate = (name, password) => {
    let isError = false;

    let errors = {
      errorName: '',
      errorPassword: ''
    };

    let identifyUser = '';
    let validatePassword = '';

    this.props.users.map(usersObj => {
      if (usersObj.name === name) {
        identifyUser = true;
      }
    });

    this.props.users.map(usersObj => {
      if (usersObj.hashedPassword === password) {
        validatePassword = true;
      }
    });

    if (name === '') {
      isError = true;
      errors.errorName = 'Please enter your name';
    }

    if (identifyUser !== true) {
      isError = true;
      errors.errorName = 'Your name was not found in the system';
    }

    if (password === '') {
      isError = true;
      errors.errorPassword = 'Please enter your password';
    }

    if (validatePassword !== true) {
      isError = true;
      errors.errorPassword = 'Your password was incorrectly inputted';
    }

    return isError ? errors : true;
  };

  handle_signin = (event, data) => {
    event.preventDefault();
    const name = this.state.name.trim();
    const password = this.state.password.trim();

    // let errors = this.validate(name, password);
    //
    // if (errors !== true) {
    //   this.setState(errors);
    // } else {
    // }
    this.props.signIn_user({ name, password });
    this.props.history.push(`/`);
  };

  render() {
    console.log('this is all user: ', this.props.users);
    return (
      <div className="login-form">
        <ReactAudioPlayer
          src="http://files.simey.me/pokonami/pallet.mp3"
          autoPlay
          loop="true"
        />
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              <Image src={pokeball2} /> Sign-In to your account
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  id="userId"
                  iconPosition="left"
                  placeholder="Name"
                  onChange={this.handle_selectedName}
                />
                {this.state.errorName !== ''
                  ? <p style={{ color: 'Red' }}>
                      {this.state.errorName}
                    </p>
                  : null}
                <Form.Input
                  fluid
                  icon="lock"
                  id="passwordId"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  onChange={this.handle_selectedPassword}
                />
                {this.state.errorPassword !== ''
                  ? <p style={{ color: 'Red' }}>
                      {this.state.errorPassword}
                    </p>
                  : null}
                <Button
                  color="teal"
                  fluid
                  size="large"
                  onClick={this.handle_signin}>
                  Sign-In
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
