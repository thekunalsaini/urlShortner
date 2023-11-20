
import * as linksController from '../controllers/linkController'
import { validator } from '../controllers/validator'
import express, { Application } from "express"; 


export const routes = ( app: Application ) => {
    app.get( '/', ( req: express.Request, res: express.Response ) => res.redirect( 301, '/api' ) )
    app.get( "/api", linksController.topThree )
    app.post( '/api/links/shorten', validator ).post( '/api/links/shorten', linksController.createLink )
    app.get( '/api/links', linksController.getAllLinks )
    app.get( '/:id', linksController.getLinkById )
    app.delete( '/api/links/delete/:GID', validator ).delete( '/api/links/delete/:GID', linksController.deleteLink )
};
