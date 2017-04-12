import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import {
    MainContainer, HomeContainer, AuthenticateContainer, ConfirmRegistrationContainer, FeedContainer,
    LogoutContainer, UserContainer, QuestionDetailsContainer , ContactUsContainer,
    SearchContainer, SearchResultsContainer} from 'containers'

export default function getRoutes (checkAuth, history) {
    return (
        <Router history={history}>
            <Route path='/' component={MainContainer}>
                <Route path='auth' component={AuthenticateContainer} />
                <Route path='confirmRegistration' component={ConfirmRegistrationContainer} />
                <Route path='feed' component={FeedContainer} />
                <Route path='logout' component={LogoutContainer} />
                <Route path='contactUs' component={ContactUsContainer} />
                <Route path='search' component={SearchContainer} />
                <Route path='/searchResults/:phrase' component={SearchResultsContainer} />
                <Route path='/user/:username' component={UserContainer} />
                <Route path='/questionDetail/:questionId' component={QuestionDetailsContainer} />
                <IndexRoute component={FeedContainer} />
            </Route>
        </Router>
    )
}