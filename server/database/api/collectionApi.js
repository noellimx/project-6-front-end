const toStorableCoordinate = (raw) => {
  const loc = [raw[1], raw[0]];

  return {
    coordinates: loc,
    type: "Point",
    crs: { type: "name", properties: { name: "EPSG:4326" } },
  };
};

const toXY4326 = (loc4326) => {
  return [loc4326[1], loc4326[0]];
};

export const dbToXY4326 = (point) => {
  return toXY4326(point.coordinates);
};

const collectionEvents = (Collection, CollectibleOrders) => {
  /**
   * 
   * 
        const config =  {
          courier: requestorName,
          stackEndLocation,
          stackRadius,
          stackingTil: later.getTime(),
        }

        stackEndLocation: {
          type: this.DataTypes.GEOMETRY("POINT",4326),
          allowNull: false,
          field: "stack_end_location",

        },
        courier: {
          type: this.DataTypes.STRING,
          allowNull: false,
        },
        stackRadius: {
          type: this.DataTypes.INTEGER,
          allowNull: false,
          field: "stack_radius",

        },
        stackingTil: {
          type: this.DataTypes.BIGINT,
          allowNull: false,
          field: "stacking_til",

        },

   */
  if (!Collection || !CollectibleOrders) {
    throw new Error(`[Collection events fail to initialize]`);
  }
  const newCollectionWithOrder = async ({ orders: _orders, config }) => {
    const {
      courier: _courier,
      stackEndLocation: _stackEndLocation,
      stackRadius: _stackRadius,
      stackingTil: _stackingTil,
      outletName: _outletName,
    } = config;
    console.log(`newCollectionWithOrder couriered by ${_courier}`);

    console.log(`newcwithneworeder`);

    console.log(toStorableCoordinate(_stackEndLocation));
    const collectionConfig = await Collection.create({
      courier: _courier,
      stackEndLocation: toStorableCoordinate(_stackEndLocation),
      stackRadius: _stackRadius,
      stackingTil: _stackingTil,
      outletName: _outletName,
    });

    const collectionId = collectionConfig.getDataValue("id");
    const orders = await Promise.all(
      _orders.map(async (o) => {
        const {
          // order,
          dropOffPoint, // coordinate
          isCollected, // boolean
          username, // purchaser
        } = o;
        const _co = await CollectibleOrders.create({
          collectionId,
          dropOffPoint: toStorableCoordinate(dropOffPoint),
          isCollected,
          username,
        });

        const _dv = _co.dataValues;
        console.log(_dv);
        console.log(_dv.dropOffPoint);
        console.log(_dv.dropOffPoint.coordinates);
        // return _dv
        return {
          isCollected: _dv.isCollected,
          username: _dv.username,
          dropOffPoint: toXY4326(_dv.dropOffPoint.coordinates),
        };
      })
    );

    // const userOrder = {
    //   order, // details will be in another list
    //   dropOffPoint: stackEndLocationRaw,
    //   isCollected: false,
    //   username: requestorName,
    // }

    const { courier, stackEndLocation, stackRadius, stackingTil, outletName } =
      collectionConfig.dataValues;

    return {
      config: {
        courier,
        outletName,
        stackEndLocation: dbToXY4326(stackEndLocation),
        stackRadius,
        stackingTil,
      },
      orders,
    };
  };

  return { newCollectionWithOrder };
};
export default collectionEvents;
