export interface TButton {
  _id: string
  title: IMultiLang
  active: boolean
}

export interface TUser {
  id: number
  roleId: number
  role: TRole
  info: TUserInfo
  team: TUserTeam
  projects: TUserProjects[]
}

export interface TUserInfo {
  public_nickname: string
  full_name: string
  email: string
  github: string
  payment_info: string
  tg: string
  phone: number
  image: string
}

export interface TRole {
  id: number
  title: string
  description: string
  level_access: number
  users: TUser[]
}

export interface TUserTeam {
  id: number
  title: string
}

export interface TUserProjects {
  id: number
  title: string
}

export interface TTask {
  id: number
  title: string
  description: string
  image: string
  tags?: string
  spotId?: string
  progress: string
  time: Date
  notification: Date
}
export interface TCustomInputsOrder {
  name: string
  value: string
}
export interface TOrderType {
  _id: string
  title: IMultiLang
  active: boolean
  isDelivery: boolean
}

export interface TOrderStatus {
  _id: string
  title: IMultiLang
  active: boolean
  isEndedStatus: boolean
}

export interface TCity {
  _id?: string
  title: string
  deliveryPrice: number
  minSummOrder: number
  deliveryFree: boolean
}

export interface TColor {
  _id: string
  mainTextColor: string
  mainColor: string
  buttonTextColor: string
  buttonColor: string
  loght: string
  textLight: string
  stroke: string
  orderMadeBlock: string
  backgroundColor: string
  popupBackup: string
  popupInputColor: string
  useLoaderImage: string | null
  useBackgroundImg: string | null
  viewGrid: boolean
  leftMenuBgColor: string
  borderButtonColor: string
  borderInputColor: string
}

export interface TTerm {
  _id: string
  juryAddress: string
  physicalAddress: string
  emailAddress: string
  phoneNumber: string
  shortName: string
  webSite: string
  bankDetails: string
  juryName: string
  INN: string
  OGRN: string
  addr_index: string
}

export enum ETariff {
  Trial = 'Trial',
  Basic = 'Basic',
  Extend = 'Extend',
  Pro = 'Pro',
  Vip = 'Vip'
}

export interface TPayment {
  _id: string
  title: any
  active: boolean
  paymentPublicID: string
}

export interface TSocialNetworks {
  _id: string
  title: string
  link: string
  active: boolean
  image: string
}
export interface TRest {
  _id: string
  titleRest: string
  countTable: number
  currentCurrency: string
  titleTable: string
  tariff: ETariff
  adminCode: string
  waiterCode: string
  telegramBotName: string
  yandexMetrika: string
  isIntegrationWithIiko: boolean
  NameIiko: string
  NameRestaurant: string
  payments_ids: TPayment[]
  enableTips: boolean
  tipsLayoutID: string
  enableBooking: boolean
  openTime: string
  closeTime: string
  logoPath: string
  workPhone: string
  workAddress: string
  buttons_ids: TButton[] | []
  orderType_ids: TOrderType[]
  orderStatus_ids: TOrderStatus[]
  colorsSchema_id: TColor
  pathRest: string
  city_ids: TCity[]
  terms_ids: TTerm
  enableSms: boolean
  defaultOrderStatus_id: string
  enableDateDelivery: boolean
  country: ECountry
  incomingOrderId?: number
  customInput_ids: TCustomInput[]
  paymentPublicID: string | null
  singleMessagePayment: boolean
  isAdult: boolean
  languages: string[]
  paymentTypes: string[]
  social_ids: TSocialNetworks[] | []
}

export enum ECountry {
  RU = 'RU',
  KZ = 'KZ',
  EN = 'EN'
}

export enum ELevelAccess {
  LOW = '1',
  Mead = '2',
  TOP = '3',
  ANGEL = '4',
  DEMIGOD = '5',
  GOD = '6'
}

export interface IMultiLang {
  [ECountry.RU]: string
  [ECountry.EN]?: string
  [ECountry.KZ]?: string
}
export interface TSale {
  _id: string
  action: boolean
  title: string
  description: string
  image: string
  dateStartSales: string
  dateFinishSales: string
  rest_id: string
}
export interface TCategoryModifier {
  _id: string
  active: boolean
  title: IMultiLang
  sort: number
  categoryModifiers_id: TCategoryModifier | string
  modifiers_ids: TModifier[]
  idFromIiko: string
  isGroupModifierCategoryRadio: boolean
  isGroupModifierRequired: boolean
}
export interface TModifier {
  _id: string
  title: IMultiLang
  active: boolean
  image: string
  sort: number
  price: number
  categoryModifier: string
  unit: string
  weight: number
  description: IMultiLang
  idFromIiko: string
}

export interface TCategory {
  id: string
  image: string
  title: string
}

export interface TSubCategories {
  subcategories: TSubCategories[] | []
  category: TCategory
}
export interface TCustomInput {
  _id: string
  name: string
  placeholder: IMultiLang
  label: IMultiLang
  required: boolean
}
export interface TAdmin {
  level_access: number
  _id: string
  nickname: string
  password: string
  rest_id?: string
}
export interface TCustomer {
  id: string
  name: string
  email: string
  tg: string
}
export interface TAdvice {
  id: string
  title: string
  content: string
}
export interface TProfileData {
  picture: string
  name: string
  github: string
  team: string
  project: string
}
