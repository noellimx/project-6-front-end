import { dbToXY4326 } from "./collectionApi.js";

const newDbLocationApi = (Outlet, District, Collection, Sequelize) => {
  if (!Outlet || !Collection || !District) {
    throw new Error("A connected sequelize model is required");
  }
  const createOutlet = async (outlet) => {
    return await Outlet.create(outlet);
  };

  const addOutletToDistrict = async ({ nearbyOutletId, name }) => {
    return await District.create({ nearbyOutletId, name });
  };

  const getNearbyOutlets = async ({ center, distanceM }) => {
    const [latitude, longitude] = center;
    const location2 = Sequelize.literal(
      `ST_GeomFromText('POINT(${longitude} ${latitude})',4326)::geography`
    );
    const targetLocation2 = Sequelize.literal(`"coordinates"::geography`);
    const distStmt2 = Sequelize.fn("ST_Distance", targetLocation2, location2);

    const nbs = await Outlet.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn(
              "ST_Distance",
              Sequelize.col("coordinates"),
              Sequelize.fn(
                "ST_SetSRID",
                Sequelize.fn("ST_MakePoint", longitude, latitude),
                "4326"
              )
            ),
            "distance",
          ],
          [distStmt2, "convertedDistance"],
        ],
      },
      where: Sequelize.fn(
        "ST_DWithin",
        Sequelize.col("coordinates"),
        Sequelize.fn(
          "ST_SetSRID",
          Sequelize.fn("ST_MakePoint", longitude, latitude),
          "4326"
        ),
        distanceM
      ),
      order: Sequelize.literal("distance ASC"),
    });

    return nbs;
  };

  const getDistanceOfOutletsFrom = async ({ center }) => {
    const [latitude, longitude] = center;
    const location2 = Sequelize.literal(
      `ST_GeomFromText('POINT(${longitude} ${latitude})',4326)::geography`
    );
    const targetLocation2 = Sequelize.literal(`"coordinates"::geography`);
    const distStmt2 = Sequelize.fn("ST_Distance", targetLocation2, location2);
    const nbs = await Outlet.findAll({
      attributes: {
        include: [[distStmt2, "distance2"]],
      },
      where: {},
    });

    return nbs;
  };

  const getCollectionWherePointIsInDropOffRange = async ({ point }) => {
    const [latitude, longitude] = point;

    const location2 = Sequelize.literal(
      `ST_GeomFromText('POINT(${longitude} ${latitude})',4326)::geography`
    );
    const targetLocation2 = Sequelize.literal(
      `"stack_end_location"::geography`
    );
    const distStmt2 = Sequelize.fn("ST_Distance", targetLocation2, location2);

    console.log(
      `getCollectionWherePointIsInDropOffRange ${[latitude, longitude]}`
    );
    const nbs = await Collection.findAll({
      attributes: {
        include: [[distStmt2, "distance2"]],
      },
      // where: Sequelize.where(Sequelize.cast(distStmt2distStmt2, 'INT'), Sequelize.Op.lt ,"stackRadius"),
      where: Sequelize.where(
        distStmt2,
        Sequelize.Op.lt,
        Sequelize.literal(`"stack_radius" * 1.00`)
      ),
      // where: {distStmt2, Sequelize.Op.lt ,"stackRadius"),
    });

    const nbss_ = await Collection.findAll({
      attributes: {
        include: [[distStmt2, "distance2"]],
      },
      // where: Sequelize.where(Sequelize.cast(distStmt2distStmt2, 'INT'), Sequelize.Op.lt ,"stackRadius"),
      // where: {distStmt2, Sequelize.Op.lt ,"stackRadius"),
    });
    console.table(nbs);
    console.table(nbs.length);

    const candOut = nbs.map((c) => {
      const {
        outletName,
        stackEndLocation,
        courier,
        stackRadius,
        stackingTil,
      } = c;
      return {
        outletName,
        stackEndLocation: dbToXY4326(stackEndLocation),
        courier,
        stackRadius,
        stackingTil,
      };
    });
    return candOut;
  };

  return {
    createOutlet,
    addOutletToDistrict,
    getNearbyOutlets,
    getDistanceOfOutletsFrom,
    getCollectionWherePointIsInDropOffRange,
  };
};

export default newDbLocationApi;
