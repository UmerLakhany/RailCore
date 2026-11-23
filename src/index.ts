import 'dotenv/config';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import v1Routes from './routes/v1';
// import v2Routes from './src/routes/v2';
import { errorHandler, handleAPIResponse } from './middlewares';
// Load model relations
import './models/relations/orders.relations';


const app: Express = express();
const port: number | string = process.env.PORT || 5001;

// app.use('/v2', express.static('../BotDocs'));

app.use(bodyParser.json());
app.use(handleAPIResponse);

const corsOptions: cors.CorsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));


app.use('/v1', v1Routes);
// app.use('/v2', v2Routes);

app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
