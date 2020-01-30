import React from 'react'
import { Route, Switch } from 'react-router'
import Home from '../views/Home/Home'
import MyPlan from '../views/MyPlan/MyPlan'
import Signup from '../views/User/Signup'

const routes = (
  <div>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/myplan" component={MyPlan} />
      <Route path="/user/signup" component={Signup} />
    </Switch>
  </div>
)

export default routes