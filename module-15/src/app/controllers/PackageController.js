import Package from '../models/Package';

class PackageController {
  async index(req, res) {
    return res.json(await Package.findAll());
  }

  async show(req, res) {
    const entity = await Package.findByPk(req.params.id);
    return res.json(entity);
  }

  async store(req, res) {
    const entity = await Package.create(req.body);
    return res.json(entity);
  }

  async update(req, res) {
    const entity = await Package.findByPk(req.params.id);
    return res.json(await entity.update(req.body));
  }

  async delete(req, res) {
    const entity = await Package.findByPk(req.params.id);
    await entity.destroy();
    return res.json();
  }
}

export default new PackageController();
