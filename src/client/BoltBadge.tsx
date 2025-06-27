import WhiteCircle from './assets/bolt-badge/white_circle_360x360/white_circle_360x360.webp';
import BlackCircle from './assets/bolt-badge/black_circle_360x360/black_circle_360x360.webp';
import { navigateTo } from '@devvit/client';

export const BoltBadge = ({
  mode,
  url = 'https://bolt.new',
}: {
  mode: 'white' | 'black';
  url?: string;
}) => {
  const Img = mode === 'white' ? WhiteCircle : BlackCircle;

  return (
    <div
      className="w-18 h-18 md:w-22 md:h-22 fixed top-4 right-4 z-50 cursor-pointer"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          navigateTo(url);
        }
      }}
      onClick={() => navigateTo(url)}
    >
      <img src={Img} alt="Bolt Badge" className="w-full h-full object-fit" />
    </div>
  );
};
