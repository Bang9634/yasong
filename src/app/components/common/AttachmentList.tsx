import React from 'react';
import { FileText, Download } from 'lucide-react';
import { formatFileSize } from '@/utils/fileUtils';
import { getFullImageUrl } from '@/utils/api';

export interface Attachment {
  id: number;
  fileName: string;
  fileUrl?: string;
  downloadUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt?: string;
}

interface AttachmentListProps {
  attachments: Attachment[];
  title?: string;
  theme?: 'light' | 'dark';
}

export function AttachmentList({ 
  attachments, 
  title = '첨부파일',
  theme = 'light'
}: AttachmentListProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const themeClasses = theme === 'dark' 
    ? {
        container: 'border-white/20',
        titleText: 'text-white',
        itemBg: 'bg-white/5 hover:bg-white/10 border-white/10',
        iconColor: 'text-white/60',
        fileNameText: 'text-white',
        fileSizeText: 'text-white/50',
        downloadIconHover: 'group-hover:text-white',
      }
    : {
        container: 'border-[#2C2C2C]/20',
        titleText: 'text-[#2C2C2C]',
        itemBg: 'bg-[#2C2C2C]/5 hover:bg-[#2C2C2C]/10 border-[#2C2C2C]/10',
        iconColor: 'text-[#2C2C2C]/60',
        fileNameText: 'text-[#2C2C2C]',
        fileSizeText: 'text-[#2C2C2C]/50',
        downloadIconHover: 'group-hover:text-[#C84630]',
      };

  return (
    <div className={`border-t ${themeClasses.container} pt-6`}>
      <h3 className={`text-xl font-bold ${themeClasses.titleText} mb-4 flex items-center`}>
        <FileText className="w-5 h-5 mr-2" />
        {title} ({attachments.length})
      </h3>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <button
            key={attachment.id}
            onClick={async () => {
              try {
                // Notice와 동일한 다운로드 로직
                if (import.meta.env.DEV) {
                  console.group('🔽 [첨부파일 다운로드 시도]');
                  console.log('파일명:', attachment.fileName);
                  console.log('attachment 객체:', attachment);
                  console.log('downloadUrl (원본):', attachment.downloadUrl);
                  console.log('fileUrl (원본):', attachment.fileUrl);
                  console.groupEnd();
                }
                
                const downloadUrl = getFullImageUrl(attachment.downloadUrl);
                
                if (import.meta.env.DEV) {
                  console.log('📡 실제 요청 URL:', downloadUrl);
                }
                
                const response = await fetch(downloadUrl);
                
                if (import.meta.env.DEV) {
                  console.log('📥 응답 상태:', response.status, response.statusText);
                  console.log('📦 Content-Type:', response.headers.get('Content-Type'));
                  console.log('📦 Content-Length:', response.headers.get('Content-Length'));
                }
                
                if (!response.ok) throw new Error('다운로드 실패');
                
                const blob = await response.blob();
                
                if (import.meta.env.DEV) {
                  console.log('✅ Blob 생성:', blob.size, 'bytes, type:', blob.type);
                }
                
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = attachment.fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                if (import.meta.env.DEV) {
                  console.log('✅ 다운로드 완료:', attachment.fileName);
                }
              } catch (error) {
                if (import.meta.env.DEV) {
                  console.error('❌ 파일 다운로드 실패:', error);
                }
                console.error('파일 다운로드 실패:', error);
                alert('파일 다운로드에 실패했습니다.');
              }
            }}
            className={`w-full flex items-center justify-between p-3 ${themeClasses.itemBg} border rounded-lg transition-colors group cursor-pointer`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className={`w-5 h-5 ${themeClasses.iconColor} flex-shrink-0`} />
              <div className="flex-1 min-w-0 text-left">
                <p className={`text-sm font-medium ${themeClasses.fileNameText} truncate`}>
                  {attachment.fileName}
                </p>
                <p className={`text-xs ${themeClasses.fileSizeText}`}>
                  {formatFileSize(attachment.fileSize)}
                </p>
              </div>
            </div>
            <Download 
              className={`w-5 h-5 ${themeClasses.iconColor} ${themeClasses.downloadIconHover} flex-shrink-0 transition-colors`} 
            />
          </button>
        ))}
      </div>
    </div>
  );
}
