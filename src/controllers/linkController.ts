import { Request, Response, NextFunction } from "express";
import { Link, ILink, LinkType } from '../model/link'
import * as shortid from 'shortid'
import * as dotenv from 'dotenv'
dotenv.config()

const baseUrl = process.env.BASE_URL

export const createLink = async ( req: Request, res: Response ): Promise<void> => {
  try {
    const gid: string = shortid.generate()
    const originalLink = req.body.originalLink
    const generatedLink: string = baseUrl ? `${baseUrl}/${gid}` : `https://${req.headers.host}/${gid}`
    const linkObject: ILink = {
      'originalLink': originalLink,
      'generatedLink': generatedLink,
      'GID': gid,
      'popularity': 0
    }
    
    const newLink: LinkType = new Link( linkObject )
    // await Link.findOneAndUpdate( { originalLink: originalLink }, newLink )
    await Link.create( linkObject )
    res.status( 201 ).json( newLink );
  } catch ( error ) {
    res.status( 404 ).json( { error: `${error}` } )
  }
}


const links = async (): Promise<ILink[]> => await Link.find( {} )


export const getAllLinks = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
  const l = await links()
  //console.log(links)
  res.json( { title: 'All Links', ...l } )
  next()
};


export const topThree = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
  const link = await Link.find( { popularity: { $gte: 0 } } )
    .sort( { popularity: -1 } )
    .limit( 3 );
    //console.log(link)
  res.json( { title: "most popular links", links: link } )
};


export const getLinkById = async ( req: Request, res: Response, next: NextFunction, ): Promise<void> => {
  const gid = req.params.id
  try {
    // increment popularity of link
    const url = await Link.findOneAndUpdate( { GID: gid }, { $inc: { popularity: 1 } } )
    console.log(url)
    url == null ? res.status( 301 ).redirect( "/api" ) : res.redirect( 301, `${url.originalLink}` )
  } catch ( error ) {
    res.status( 301 ).redirect( "/api" )
  }
  next()
}


export const deleteLink = async ( req: Request, res: Response ): Promise<void> => {
  const gid = req.params.gid
  try {
    await Link.findOneAndDelete( { GID: gid } )
    res.status( 204 )
  } catch ( error ) {
    res.status( 404 ).json( { error: `${error}` } )
  }
}
