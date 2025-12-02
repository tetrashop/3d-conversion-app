import { BarChart3, Users, Upload, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">داشبورد مدیریت</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <BarChart3 className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">تبدیل‌های کل</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">کاربران</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Upload className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">در صف</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="text-purple-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-600">موفق</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
