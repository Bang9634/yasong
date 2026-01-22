import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { websiteAPI } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';

interface Souvenir {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export function WebsiteManagement() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // 배경 이미지
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);

  // 텍스트 데이터
  const [textData, setTextData] = useState({
    aboutTitle: '',
    aboutDescription: '',
    directorName: '',
    directorMessage: '',
  });
  const [isTextLoading, setIsTextLoading] = useState(false);

  // 기념품 관리
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [isSouvenirsLoading, setIsSouvenirsLoading] = useState(false);
  const [editingSouvenir, setEditingSouvenir] = useState<Souvenir | null>(null);
  const [newSouvenir, setNewSouvenir] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
  });

  // 권한 확인
  useEffect(() => {
    if (loading) return;
    
    if (!user || !isManagerOrAbove(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // 데이터 로드
  useEffect(() => {
    if (!user || !isManagerOrAbove(user.role)) return;
    
    const fetchData = async () => {
      try {
        // 홈페이지 설정 조회
        const settings = await websiteAPI.getSettings();
        setBackgroundUrl(settings.backgroundUrl || '');
        setTextData({
          aboutTitle: settings.aboutTitle || '',
          aboutDescription: settings.aboutDescription || '',
          directorName: settings.directorName || '',
          directorMessage: settings.directorMessage || '',
        });

        // 기념품 목록 조회
        const souvenirList = await websiteAPI.getSouvenirs();
        setSouvenirs(souvenirList);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      }
    };

    fetchData();
  }, [user]);

  // 배경 이미지 업데이트
  const handleBackgroundUpdate = async () => {
    try {
      setIsBackgroundLoading(true);
      await websiteAPI.updateBackground({ backgroundUrl });
      alert('배경 이미지가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsBackgroundLoading(false);
    }
  };

  // 텍스트 데이터 업데이트
  const handleTextUpdate = async () => {
    try {
      setIsTextLoading(true);
      await websiteAPI.updateText(textData);
      alert('텍스트 데이터가 업데이트되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업데이트에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsTextLoading(false);
    }
  };

  // 기념품 추가
  const handleAddSouvenir = async () => {
    if (!newSouvenir.name || !newSouvenir.description) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setIsSouvenirsLoading(true);
      const created = await websiteAPI.createSouvenir(newSouvenir);
      setSouvenirs([...souvenirs, created]);
      setNewSouvenir({ name: '', description: '', price: 0, imageUrl: '' });
      alert('기념품이 추가되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '추가에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsSouvenirsLoading(false);
    }
  };

  // 기념품 수정
  const handleUpdateSouvenir = async () => {
    if (!editingSouvenir) return;

    try {
      setIsSouvenirsLoading(true);
      await websiteAPI.updateSouvenir(editingSouvenir.id, editingSouvenir);
      setSouvenirs(souvenirs.map(s => s.id === editingSouvenir.id ? editingSouvenir : s));
      setEditingSouvenir(null);
      alert('기념품이 수정되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '수정에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsSouvenirsLoading(false);
    }
  };

  // 기념품 삭제
  const handleDeleteSouvenir = async (souvenirId: string) => {
    const confirmed = window.confirm('정말로 이 기념품을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      setIsSouvenirsLoading(true);
      await websiteAPI.deleteSouvenir(souvenirId);
      setSouvenirs(souvenirs.filter(s => s.id !== souvenirId));
      alert('기념품이 삭제되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsSouvenirsLoading(false);
    }
  };

  if (loading || !user || !isManagerOrAbove(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-teal-900 mb-2">홈페이지 관리</h1>
            <p className="text-gray-600">웹사이트의 배경 이미지, 텍스트, 기념품 목록을 관리할 수 있습니다.</p>
          </div>

          <div className="space-y-6">
            {/* 배경 이미지 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">배경 이미지</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="backgroundUrl">이미지 URL</Label>
                  <Input
                    id="backgroundUrl"
                    type="text"
                    value={backgroundUrl}
                    onChange={(e) => setBackgroundUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button
                  onClick={handleBackgroundUpdate}
                  disabled={isBackgroundLoading}
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                >
                  {isBackgroundLoading ? '저장 중...' : '배경 이미지 저장'}
                </Button>
              </div>
            </div>

            {/* 텍스트 데이터 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">텍스트 데이터</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="aboutTitle">미술관 소개 제목</Label>
                  <Input
                    id="aboutTitle"
                    type="text"
                    value={textData.aboutTitle}
                    onChange={(e) => setTextData({ ...textData, aboutTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="aboutDescription">미술관 소개 내용</Label>
                  <Textarea
                    id="aboutDescription"
                    value={textData.aboutDescription}
                    onChange={(e) => setTextData({ ...textData, aboutDescription: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="directorName">관장 이름</Label>
                  <Input
                    id="directorName"
                    type="text"
                    value={textData.directorName}
                    onChange={(e) => setTextData({ ...textData, directorName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="directorMessage">관장 메시지</Label>
                  <Textarea
                    id="directorMessage"
                    value={textData.directorMessage}
                    onChange={(e) => setTextData({ ...textData, directorMessage: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleTextUpdate}
                  disabled={isTextLoading}
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                >
                  {isTextLoading ? '저장 중...' : '텍스트 데이터 저장'}
                </Button>
              </div>
            </div>

            {/* 기념품 목록 관리 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">기념품 관리</h2>
              
              {/* 기념품 추가 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">새 기념품 추가</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>이름</Label>
                    <Input
                      value={newSouvenir.name}
                      onChange={(e) => setNewSouvenir({ ...newSouvenir, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>가격</Label>
                    <Input
                      type="number"
                      value={newSouvenir.price}
                      onChange={(e) => setNewSouvenir({ ...newSouvenir, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>설명</Label>
                    <Textarea
                      value={newSouvenir.description}
                      onChange={(e) => setNewSouvenir({ ...newSouvenir, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>이미지 URL</Label>
                    <Input
                      value={newSouvenir.imageUrl}
                      onChange={(e) => setNewSouvenir({ ...newSouvenir, imageUrl: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddSouvenir}
                  disabled={isSouvenirsLoading}
                  className="mt-4 bg-teal-700 hover:bg-teal-800 text-white"
                >
                  기념품 추가
                </Button>
              </div>

              {/* 기념품 목록 */}
              <div className="space-y-4">
                {souvenirs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">등록된 기념품이 없습니다.</p>
                ) : (
                  souvenirs.map((souvenir) => (
                    <div key={souvenir.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{souvenir.name}</h4>
                          <p className="text-gray-600 text-sm mt-1">{souvenir.description}</p>
                          <p className="text-teal-700 font-semibold mt-2">₩{souvenir.price.toLocaleString()}</p>
                          {souvenir.imageUrl && (
                            <p className="text-gray-400 text-xs mt-1">이미지: {souvenir.imageUrl}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setEditingSouvenir(souvenir)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
                          >
                            수정
                          </Button>
                          <Button
                            onClick={() => handleDeleteSouvenir(souvenir.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 기념품 수정 다이얼로그 */}
          {editingSouvenir && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">기념품 수정</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label>이름</Label>
                    <Input
                      value={editingSouvenir.name}
                      onChange={(e) => setEditingSouvenir({ ...editingSouvenir, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>가격</Label>
                    <Input
                      type="number"
                      value={editingSouvenir.price}
                      onChange={(e) => setEditingSouvenir({ ...editingSouvenir, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>설명</Label>
                    <Textarea
                      value={editingSouvenir.description}
                      onChange={(e) => setEditingSouvenir({ ...editingSouvenir, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>이미지 URL</Label>
                    <Input
                      value={editingSouvenir.imageUrl}
                      onChange={(e) => setEditingSouvenir({ ...editingSouvenir, imageUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={handleUpdateSouvenir}
                    disabled={isSouvenirsLoading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {isSouvenirsLoading ? '저장 중...' : '저장'}
                  </Button>
                  <Button
                    onClick={() => setEditingSouvenir(null)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
