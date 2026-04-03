const fallbackCrosswalks = [
  {
    _id: "699f27d6b6cae8b2c7d16400",
    name: "Holon, Sokolov 48",
    location: { lat: 32.022759561386, lng: 34.774537635844844 },
    status: "active",
    ledSystemUrl: "http://192.168.1.10",
  },
  {
    _id: "699f27d6b6cae8b2c7d16500",
    name: "Holon, Shenkar 12",
    location: { lat: 32.027086, lng: 34.77686 },
    status: "active",
    ledSystemUrl: "http://192.168.1.11",
  },
  {
    _id: "699f27d6b6cae8b2c7d16600",
    name: "Holon, Pinhas Lavon 2",
    location: { lat: 32.00829660858082, lng: 34.768726723908145 },
    status: "maintenance",
    ledSystemUrl: "http://192.168.1.12",
  },
];

let fallbackAlerts = [
  {
    _id: "fallback-alert-1",
    crosswalkId: "699f27d6b6cae8b2c7d16400",
    description: "Pedestrian waiting on edge",
    imageUrl:
      "https://www.shutterstock.com/image-photo/man-on-pedestrian-crossing-waiting-260nw-691829371.jpg",
    detectionDistance: 1.5,
    detectedObjectsCount: 1,
    ledActivated: true,
    isHazard: true,
    reasons: ["Pedestrian near curb"],
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    _id: "fallback-alert-2",
    crosswalkId: "699f27d6b6cae8b2c7d16400",
    description: "Bicycle crossing fast",
    imageUrl:
      "https://images.wcdn.co.il/f_auto,q_auto,w_1200,t_54/1/3/8/8/1388157-46.jpg",
    detectionDistance: 3.2,
    detectedObjectsCount: 1,
    ledActivated: true,
    isHazard: true,
    reasons: ["Fast-moving object near crossing"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    _id: "fallback-alert-3",
    crosswalkId: "699f27d6b6cae8b2c7d16500",
    description: "Group of children",
    imageUrl:
      "https://pop.education.gov.il/remote.axd?https://meyda.education.gov.il/files/pop/21695/shutterstock_726878521-1.jpg?anchor=center&mode=crop&width=630&height=0&rnd=132791993110000000",
    detectionDistance: 2,
    detectedObjectsCount: 4,
    ledActivated: true,
    isHazard: true,
    reasons: ["Multiple pedestrians detected"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: "fallback-alert-4",
    crosswalkId: "699f27d6b6cae8b2c7d16600",
    description: "False alarm - small animal",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNrkBfNiH2vbyI5zZPWZKjTXfuQfbNlDlzpQ&s",
    detectionDistance: 0.5,
    detectedObjectsCount: 1,
    ledActivated: false,
    isHazard: false,
    reasons: ["Non-human object detected"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

const toCrosswalkId = (crosswalkId) =>
  typeof crosswalkId === "object" && crosswalkId !== null
    ? crosswalkId._id
    : crosswalkId;

const populateFallbackAlert = (alert) => {
  const crosswalkId = toCrosswalkId(alert.crosswalkId);
  const crosswalk =
    fallbackCrosswalks.find((item) => item._id === crosswalkId) || null;

  return {
    ...clone(alert),
    crosswalkId: crosswalk ? clone(crosswalk) : crosswalkId,
  };
};

export const getFallbackCrosswalks = () => clone(fallbackCrosswalks);

export const getFallbackCrosswalkById = (id) =>
  clone(fallbackCrosswalks.find((crosswalk) => crosswalk._id === id) || null);

export const addFallbackCrosswalk = (crosswalkData) => {
  const newCrosswalk = {
    _id: `fallback-crosswalk-${Date.now()}`,
    name: crosswalkData.name || "Fallback Crosswalk",
    location: crosswalkData.location || { lat: 0, lng: 0 },
    status: crosswalkData.status || "inactive",
    ledSystemUrl: crosswalkData.ledSystemUrl || "",
  };

  fallbackCrosswalks.unshift(newCrosswalk);
  return clone(newCrosswalk);
};

export const getFallbackAlerts = ({ crosswalkId } = {}) => {
  const filteredAlerts = crosswalkId
    ? fallbackAlerts.filter(
        (alert) => String(toCrosswalkId(alert.crosswalkId)) === String(crosswalkId),
      )
    : fallbackAlerts;

  return filteredAlerts
    .slice()
    .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp))
    .map(populateFallbackAlert);
};

export const addFallbackAlert = (alertData) => {
  const fallbackAlert = {
    _id: `fallback-alert-${Date.now()}`,
    crosswalkId:
      alertData.crosswalkId || fallbackCrosswalks[0]?._id || "fallback-crosswalk",
    imageUrl: alertData.imageUrl || null,
    description: alertData.description || "Automatic AI Detection: Danger detected.",
    detectionDistance: alertData.detectionDistance ?? 0,
    detectedObjectsCount: alertData.detectedObjectsCount ?? 1,
    ledActivated: alertData.ledActivated ?? false,
    isHazard: alertData.isHazard ?? true,
    reasons: Array.isArray(alertData.reasons) ? alertData.reasons : [],
    timestamp: alertData.timestamp
      ? new Date(alertData.timestamp).toISOString()
      : new Date().toISOString(),
  };

  fallbackAlerts.unshift(fallbackAlert);
  return populateFallbackAlert(fallbackAlert);
};
