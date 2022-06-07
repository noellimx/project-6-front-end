import { Sequelize } from "sequelize";
import DbModel from "./models/index.js";
import newDbAuthApi from "./api/authApi.js";
import newDbLocationApi from "./api/locationApi.js";
import sessionEvents from "./api/sessionApi.js";
import collectionEvents from "./api/collectionApi.js";
// Enforces Model Initialization via inheritance.

const dummyOutlet = ({ coordinates, address, name }) => ({
  coordinates: {
    ...coordinates,
    coordinates: [coordinates.coordinates[1], coordinates.coordinates[0]],
    crs: { type: "name", properties: { name: "EPSG:4326" } },
  },
  ...address,
  name,
});
export class Database extends DbModel {
  _seed = async () => {
    console.log(`                                     [_Seeding]`);
    console.log();
    console.log();
    console.log();
    /** Users */
    const username = "dave";
    const password = "1";
    console.log(
      await this.auth.registerUser({
        username,
        plainPassword: password,
        password2: password,
      })
    );

    console.log(
      await this.auth.registerUser({
        username: "sally",
        plainPassword: "1",
        password2: "1",
      })
    );

    /** Outlets */

    const outlet1 = dummyOutlet({
      coordinates: {
        type: "Point",

        coordinates: [1.3189760741954744, 103.81554719080732],
      },
      address: {
        streetName: "Cluny Park Road",
        buildingNo: 50,
        postalCode: 257488,
      },
      name: "bisnees",
    });

    const pivotCoordinate = [1.353664975577646, 103.83431850981404];
    const pivotCoordinate2 = [1.3533394648595565, 103.83463824076635];
    const outlet_up_1 = dummyOutlet({
      coordinates: {
        type: "Point",
        coordinates: pivotCoordinate,
      },
      address: {
        streetName: "Upper Thomson Road",
        buildingNo: "246M",
        postalCode: 574370,
      },
      name: "lotiplatahaus",
    });

    const outlet_up_2_200 = dummyOutlet({
      coordinates: {
        type: "Point",
        coordinates: pivotCoordinate2,
      },
      address: {
        streetName: "Upper Thomson Road",
        buildingNo: "244P",
        postalCode: 574369,
      },
      name: "beachroadscissorcut",
    });

    const outlet_up_3_400 = dummyOutlet({
      coordinates: {
        type: "Point",
        coordinates: [1.355265964834185, 103.8362240461392],
      },
      address: {
        streetName: "Sin Ming Road",
        buildingNo: "24",
        postalCode: 570024,
      },
      name: "sinminglotiplata",
    });

    for await (const _outlet of [
      outlet_up_1,
      outlet_up_2_200,
      outlet_up_3_400,
    ]) {
      const outlet = await this.location.createOutlet(_outlet);
    }

    const outlet = await this.location.createOutlet(outlet1);

    /** District */
    const outletId = outlet.getDataValue("id");
    await this.location.addOutletToDistrict({
      nearbyOutletId: outletId,
      name: "district-51",
    });

    /** */
    const distances = [
      10, 20, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 200, 300, 500,
      1000, 1200, 1500, 2000,
    ];

    const nearbybys = await Promise.all(
      distances.map((d) =>
        this.location.getNearbyOutlets({
          center: pivotCoordinate,
          distanceM: d,
        })
      )
    );

    const nnn = nearbybys.map((nearby) => {
      return nearby.map(({ dataValues }) => {
        const { name, distance, convertedDistance, coordinates } = dataValues;
        return {
          name,
          distance,
          storedC: JSON.stringify(coordinates),
          convertedDistance: JSON.stringify(convertedDistance),
        };
      });
    });
    console.log(`given`);
    console.log(pivotCoordinate);
    nnn.forEach((e) => console.log(e));

    const allDist = await this.location.getDistanceOfOutletsFrom({
      center: pivotCoordinate2,
    });

    console.log();
    console.log();
    console.log();

    console.log(`End                                     [_Seeding]`);
    console.log();
    console.log();
    console.log();
  };

  constructor(sequelize) {
    super(sequelize);
    // Initialize
    this.sequelize = sequelize;
    console.log(`[Database]`);
    console.log(this.sequelize.models);

    const {
      outlet: Outlet,
      district: District,
      user: User,
      lastKnownSessionUser: LastKnownSessionUser,
      collection: Collection,
      collectibleOrder: CollectibleOrder,
    } = this.sequelize.models;
    console.log(this.sequelize.models);
    this.Outlet = Outlet;
    this.District = District;
    this.User = User;
    this.LastKnownSessionUser = LastKnownSessionUser;
    this.Collection = Collection;
    this.CollectibleOrder = CollectibleOrder;
    this.location = newDbLocationApi(
      this.Outlet,
      this.District,
      this.Collection,
      this.Sequelize
    );

    this.auth = newDbAuthApi(this.sequelize);

    this.session = sessionEvents(this.LastKnownSessionUser);

    this.collection = collectionEvents(this.Collection, this.CollectibleOrder);
  }

  wipe = async () => {
    for await (const model of [
      this.LastKnownSessionUser,
      this.District,
      this.Outlet,
      this.User,
      this.Collection,
    ]) {
      await model.destroy({ where: {} });
    }
  };
  seed = this._seed;
  close = () => this.sequelize.close();
}

/**
 *
 * @param {Sequelize} sequelize
 * @returns {Database}
 */
export const initDatabase = (sequelize) => {
  return new Database(sequelize);
};

export default initDatabase;
