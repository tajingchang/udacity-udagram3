import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { has, startsWith } from 'lodash';

(async () => {

  // Initiate the Express application
  const app = express();

  // Setting the network port
  const port = process.env.PORT || 8082;


  // For post requests use the body parser middleware 
  app.use(bodyParser.json());

  app.get('/filteredimage', async (req: Request, res: Response): Promise<void> => {
    if (!has(req.query, 'image_url')) {
      res.status(400).json({
        message: '[ image_url ] Requires'
      });
    }

	// Validation of url
    const { image_url } = req.query;
    if (!startsWith(image_url, 'http')) {
      res.status(422).json({
        message: 'Valid image url is required'
      });
    }
	
	
	// Imagefiltering
    const imgPath: string = await filterImageFromURL(image_url);
    await res.sendFile(imgPath, (err: Error) => {
      if (err) {
        console.log(err);
      }
      deleteLocalFiles([imgPath]);
    });
  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response): Promise<void> => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
