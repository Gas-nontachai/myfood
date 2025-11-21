export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageLabel: string;
  image: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type StatusStep = {
  id: string;
  label: string;
  description: string;
};

export const mockMenuItems: MenuItem[] = [
  {
    id: 'padthai',
    name: 'ผัดไทยกุ้งสด',
    price: 89,
    category: 'อาหารจานเดียว',
    description: 'เส้นเหนียวนุ่มผัดกับซอสสูตรพิเศษ พร้อมกุ้งสดและถั่วลิสงโรย',
    imageLabel: 'ผัดไทย',
    image: '/mock/padthai.jpg'
  },
  {
    id: 'green-curry',
    name: 'แกงเขียวหวานไก่',
    price: 115,
    category: 'อาหารจานเดียว',
    description: 'เครื่องแกงเข้มข้น กะทิเข้าเนื้อ เสิร์ฟพร้อมข้าวหอมมะลิ',
    imageLabel: 'แกงเขียวหวาน',
    image: '/mock/greencurry.jpg'
  },
  {
    id: 'thaitea',
    name: 'ชาไทยเย็น',
    price: 35,
    category: 'เครื่องดื่ม',
    description: 'ชาไทยเข้มข้น ผสมนมสดหวานละมุน',
    imageLabel: 'ชาไทย',
    image: '/mock/thaitea.jpg'
  },
  {
    id: 'mango-sticky',
    name: 'ข้าวเหนียวมะม่วง',
    price: 69,
    category: 'ของหวาน',
    description: 'ข้าวเหนียวนุ่มกับมะม่วงน้ำดี เสิร์ฟกับกะทิหอม',
    imageLabel: 'ข้าวเหนียวมะม่วง',
    image: '/mock/mango.jpg'
  }
];

export const mockCartItems: CartItem[] = [
  { id: 'padthai', name: 'ผัดไทยกุ้งสด', price: 89, quantity: 1 },
  { id: 'thaitea', name: 'ชาไทยเย็น', price: 35, quantity: 2 }
];

export const orderStatusSteps: StatusStep[] = [
  { id: 'cooking', label: 'กำลังปรุง', description: 'เชฟกำลังทอดและจัดจาน' },
  { id: 'serving', label: 'กำลังเสิร์ฟ', description: 'พนักงานเตรียมเสิร์ฟที่โต๊ะของคุณ' },
  { id: 'done', label: 'เสร็จสิ้น', description: 'เสิร์ฟเรียบร้อยแล้ว' }
];
