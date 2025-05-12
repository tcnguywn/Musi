import { Outlet } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import AudioPlayer from '../components/AudioPlayer.tsx';
import LeftSidebar from '../components/LeftSidebar.tsx';
import {PlayerControls} from '../components/PlayerControl.tsx';
import RightSidebar from '../components/RightSidebar.tsx';
const MainLayout = () => {
	return (
		<div className='h-screen bg-black text-white flex flex-col'>
			<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
				<AudioPlayer />

				{/* left sidebar */}
				<ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
					<LeftSidebar />
				</ResizablePanel>

				<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

				{/* Main content */}
				<ResizablePanel defaultSize={60}>
					<Outlet />
				</ResizablePanel>

				<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

				{/* right sidebar */}
				<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
					<RightSidebar />
				</ResizablePanel>
			</ResizablePanelGroup>

			<PlayerControls />
		</div>
	);
};

export default MainLayout;