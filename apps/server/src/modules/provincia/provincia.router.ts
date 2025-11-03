import { Router } from 'express';
import * as c from './provincia.controller.js';
const r = Router();

r.get('/', c.list);
r.get('/:id', c.getById);
r.post('/', c.create);
r.put('/:id', c.update);
r.delete('/:id', c.remove);

export default r;
