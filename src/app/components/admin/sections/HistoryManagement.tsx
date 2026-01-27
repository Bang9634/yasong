import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { websiteAPI } from '@/utils/api';
import { Plus, Trash2 } from 'lucide-react';

interface HistoryItem {
  year: string;
  description: string;
}

interface HistoryManagementProps {
  initialItems?: HistoryItem[];
}

export function HistoryManagement({ initialItems = [] }: HistoryManagementProps) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(initialItems);
  const [newHistoryYear, setNewHistoryYear] = useState<string>('');
  const [newHistoryDescription, setNewHistoryDescription] = useState<string>('');
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setHistoryItems(initialItems);
    }
  }, [initialItems]);

  const handleAddHistoryItem = () => {
    if (!newHistoryYear.trim() || !newHistoryDescription.trim()) {
      alert('연도와 내용을 모두 입력해주세요.');
      return;
    }

    const newItem: HistoryItem = {
      year: newHistoryYear.trim(),
      description: newHistoryDescription.trim(),
    };

    setHistoryItems([...historyItems, newItem]);
    setNewHistoryYear('');
    setNewHistoryDescription('');
  };

  const handleUpdateHistoryItem = (index: number, field: 'year' | 'description', value: string) => {
    const updated = [...historyItems];
    updated[index][field] = value;
    setHistoryItems(updated);
  };

  const handleDeleteHistoryItem = (index: number) => {
    if (!confirm('이 연혁 항목을 삭제하시겠습니까?')) return;
    setHistoryItems(historyItems.filter((_, i) => i !== index));
  };

  const handleSaveHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const jsonValue = JSON.stringify(historyItems);
      await websiteAPI.updateTextSetting('museum_history', jsonValue);
      alert('미술관 연혁이 저장되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '저장에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">미술관 주요 연혁</h2>
      <p className="text-sm text-gray-600 mb-4">미술관의 주요 연혁을 관리할 수 있습니다. 연도와 내용을 입력하여 추가하세요.</p>
      
      {/* 새 항목 추가 폼 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">새 연혁 추가</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="newHistoryYear">연도</Label>
            <Input
              id="newHistoryYear"
              type="text"
              value={newHistoryYear}
              onChange={(e) => setNewHistoryYear(e.target.value)}
              placeholder="예: 2020년"
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="newHistoryDescription">내용</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="newHistoryDescription"
                type="text"
                value={newHistoryDescription}
                onChange={(e) => setNewHistoryDescription(e.target.value)}
                placeholder="예: 군립청송야송미술관 개관"
                onKeyPress={(e) => e.key === 'Enter' && handleAddHistoryItem()}
              />
              <Button
                onClick={handleAddHistoryItem}
                className="bg-teal-700 hover:bg-teal-800 text-white whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-1" />
                추가
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 기존 항목 목록 */}
      <div className="space-y-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">현재 연혁 목록</h3>
        {historyItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">등록된 연혁이 없습니다.</p>
        ) : (
          historyItems.map((item, index) => (
            <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="text"
                  value={item.year}
                  onChange={(e) => handleUpdateHistoryItem(index, 'year', e.target.value)}
                  placeholder="연도"
                />
                <Input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleUpdateHistoryItem(index, 'description', e.target.value)}
                  placeholder="내용"
                  className="md:col-span-2"
                />
              </div>
              <Button
                onClick={() => handleDeleteHistoryItem(index)}
                variant="destructive"
                size="icon"
                className="flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* 저장 버튼 */}
      <Button
        onClick={handleSaveHistory}
        disabled={isHistoryLoading || historyItems.length === 0}
        className="bg-teal-700 hover:bg-teal-800 text-white w-full"
      >
        {isHistoryLoading ? '저장 중...' : '연혁 저장'}
      </Button>
    </div>
  );
}
