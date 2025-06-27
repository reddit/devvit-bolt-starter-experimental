import WhiteCircle from './assets/bolt-badge/white_circle_360x360/white_circle_360x360.webp';
import BlackCircle from './assets/bolt-badge/black_circle_360x360/black_circle_360x360.webp';

export const BoltBadge = ({ mode }: { mode: 'white' | 'black' }) => {
  const Img = mode === 'white' ? WhiteCircle : BlackCircle;

  return (
    <div className="w-18 h-18 md:w-22 md:h-22 fixed top-4 right-4 z-50">
      <img src={Img} alt="Bolt Badge" className="w-full h-full object-fit" />
    </div>
  );
};
