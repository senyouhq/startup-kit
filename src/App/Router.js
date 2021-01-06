import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Container from '@material-ui/core/Container'

import Top from 'containers/Top'
import Sample from 'containers/Sample'

import Header from 'components/Header'

function BaseRouter() {
  return (
    <div className="app-router">
      <Header />
      <Container maxWidth="md">
        <Switch>
          <Route exact path="/" component={Top} />
          <Route exact path="/sample" component={Sample} />
          <Redirect to="/" />
        </Switch>
      </Container>
    </div>
  )
}

export default BaseRouter
