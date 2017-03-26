import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import {
    MainContainer, HomeContainer, AuthenticateContainer, ConfirmRegistrationContainer, FeedContainer,
    LogoutContainer, UserContainer, QuestionDetailsContainer , ContactUsContainer} from 'containers'

export default function getRoutes (checkAuth, history) {
    return (
        <Router history={history}>
            <Route path='/' component={MainContainer}>
                <Route path='auth' component={AuthenticateContainer} onEnter={checkAuth} />
                <Route path='confirmRegistration' component={ConfirmRegistrationContainer} />
                <Route path='feed' component={FeedContainer} />
                <Route path='logout' component={LogoutContainer} />
                <Route path='contactUs' component={ContactUsContainer} />
                <Route path='/:username' component={UserContainer} onEnter={checkAuth} />
                <Route path='/duckDetail/:questionId' component={QuestionDetailsContainer} />
                <IndexRoute component={FeedContainer} onEnter={checkAuth}/>
            </Route>
        </Router>
    )
}