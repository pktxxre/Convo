import type { Reply } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';

interface ReplyCardProps {
  reply: Reply;
}

export default function ReplyCard({ reply }: ReplyCardProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Avatar name={reply.authorName} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">{reply.authorName}</span>
          <span className="text-xs text-[#A8A8A8] dark:text-[#636366]">{reply.authorMajor}</span>
          <span className="text-[#DBDBDB] dark:text-[#38383A]">·</span>
          <span className="text-xs text-[#A8A8A8] dark:text-[#636366]">{formatRelativeTime(reply.createdAt)}</span>
        </div>
        <p className="text-sm text-[#1a1a1a] dark:text-[#E5E5E5] mt-1 leading-relaxed">{reply.body}</p>
      </div>
    </div>
  );
}
