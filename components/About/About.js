import Button from '../Button';
import Icon from '../Icon';
import { useContext } from 'react';
import { ModalContext } from '@/providers/ModalContext';

export default function About({ version, handleModalClose }) {
  const { toggleModal } = useContext(ModalContext);
  return (
    <div className='grid grid-rows-[1fr_auto] w-full max-w-sm h-full gap-4 bg-surface rounded-xl text-uiText ring-1 ring-border/80 shadow-xl'>
      <div className='p-6 pb-0 overflow-y-auto overflow-x-hidden'>
        <div className='flex flex-col items-center justify-center text-center gap-4'>
          <Icon size={'xl'}>
            <svg
              fill='none'
              height='160'
              viewBox='0 0 160 160'
              width='160'
              xmlns='http://www.w3.org/2000/svg'
            >
              <linearGradient
                id='a'
                gradientUnits='userSpaceOnUse'
                x1='80'
                x2='80'
                y1='0'
                y2='160'
              >
                <stop offset='0' stopColor='#ffa835' />
                <stop offset='1' stopColor='#f91' />
              </linearGradient>
              <rect fill='url(#a)' height='160' rx='32' width='160' />
              <path
                clipRule='evenodd'
                d='m135.793 149.585c8.169 0 14.792-6.623 14.792-14.792 0-8.17-6.623-14.793-14.792-14.793-8.17 0-14.793 6.623-14.793 14.793 0 8.169 6.623 14.792 14.793 14.792zm-3.006-22.917-2.553 1.433 2.553 1.468zm1.412 3.713v-4.884c0-.556-.598-.906-1.082-.634l-4.627 2.597c-.492.276-.495.983-.006 1.264l4.303 2.474v7.424l-4.367 2.492c-.49.279-.489.985.002 1.263l4.692 2.663c.484.275 1.085-.075 1.085-.633v-4.965l6.49-3.702 4.357 2.504c.485.279 1.089-.071 1.089-.63v-5.357c0-.557-.602-.907-1.087-.631l-4.357 2.486zm0 1.629v5.806l5.07-2.892zm7.912 2.918 2.612 1.501v-2.991zm-9.324 5.32-2.621 1.496 2.621 1.486zm6.264-13.569v2.87l2.522-1.426zm-1.412-1.182c0-.558.603-.908 1.088-.631l4.594 2.629c.489.28.487.987-.004 1.264l-4.593 2.597c-.485.274-1.085-.076-1.085-.632zm1.412 17.671v-2.87l2.522 1.444zm-.324-4.683c-.485-.277-1.088.072-1.088.631v5.227c0 .556.6.906 1.085.632l4.593-2.597c.491-.277.493-.984.004-1.264zm-11.546-4.948v2.87l2.522-1.426zm-1.412-1.182c0-.558.603-.908 1.088-.631l4.593 2.629c.49.28.488.987-.003 1.264l-4.594 2.597c-.484.274-1.084-.076-1.084-.632z'
                fill='#000'
                fillRule='evenodd'
              />
              <path
                d='m105.164 68.0893-2.801-18.4554c-.44-2.9001-3.1726-4.9128-6.0728-4.4727l-63.2754 9.6032c-2.9001.4402-4.9128 3.1731-4.4727 6.0732l8.0027 52.7294c.4401 2.9 3.1731 4.913 6.0732 4.473l63.275-9.603c2.901-.44 4.913-3.173 4.473-6.074l-2.801-18.4549 13.908 10.2425c3.826 2.8178 9.161-.4194 8.448-5.1123l-4.937-32.5341c-.712-4.6929-6.767-6.2015-9.585-2.3753z'
                stroke='#000'
                strokeWidth='6'
              />
              <g fill='#000'>
                <circle
                  cx='46.1116'
                  cy='69.9714'
                  r='4'
                  transform='matrix(.98867845 -.15004976 .15004976 .98867845 -9.977137 7.711219)'
                />
                <path d='m54.6212 72.7257-1.2004-7.9094 1.8016-.2735.9926 6.5399 3.6513-.5542.2079 1.3696z' />
                <path d='m61.1322 71.7375-1.2004-7.9094 1.8017-.2734 1.2004 7.9094z' />
                <path d='m66.9739 70.851-4.1551-7.461 1.9938-.3026 2.8916 5.9363.988-6.5251 1.9458-.2953-1.7543 8.3578z' />
                <path d='m72.8724 69.9558-1.2004-7.9095 5.4771-.8312.2009 1.3239-3.6754.5578.2841 1.8718 2.9907-.4539.201 1.324-2.9908.4539.3135 2.0658 3.6754-.5578.201 1.3239z' />
              </g>
            </svg>
          </Icon>
          <h3>Amazon IVS Web Broadcast Tool</h3>
        </div>
        <div className='flex text-center flex-col'>
          <p className='text-sm mb-3 text-uiText/50'>
            SDK Version: {`${version.split('-')[0]}`}
          </p>
          <span className='text-sm mb-3 text-uiText/50'>
            View source code on{' '}
            <a
              href='https://github.com/aws-samples/amazon-ivs-broadcast-web-demo'
              target='_blank'
              rel='noreferrer noopener'
              className='text-uiText/50 hover:text-uiText underline underline-offset-1'
            >
              Github
            </a>
          </span>
          <p className='text-xs text-uiText/50'>
            For more demos, visit{' '}
            <a
              href='https://ivs.rocks/examples/'
              target='_blank'
              rel='noreferrer noopener'
              className='text-uiText/50 hover:text-uiText underline underline-offset-1'
            >
              ivs.rocks/examples
            </a>
          </p>
        </div>
      </div>
      <footer className='flex flex-col w-full items-center justify-center gap-4 p-6 pt-0'>
        <Button style='roundedText' fullWidth={true} onClick={toggleModal}>
          Close
        </Button>
      </footer>
    </div>
  );
}
