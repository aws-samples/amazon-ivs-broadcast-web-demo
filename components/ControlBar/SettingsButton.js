import Button from '../Button';
import Icon from '../Icon';

export function SettingsButton({ handleSettings, ...additionalProps }) {
  return (
    <Button style='round' onClick={handleSettings} {...additionalProps}>
      <Icon>
        <svg
          className='w-full'
          width='48'
          height='48'
          viewBox='0 0 48 48'
          xmlns='http://www.w3.org/2000/svg'
          id='cog'
        >
          <path d='M27.3 44H20.7Q20.15 44 19.725 43.65Q19.3 43.3 19.2 42.75L18.4 37.7Q17.45 37.35 16.4 36.75Q15.35 36.15 14.55 35.5L9.9 37.65Q9.35 37.9 8.8 37.725Q8.25 37.55 7.95 37L4.65 31.15Q4.35 30.65 4.5 30.1Q4.65 29.55 5.1 29.2L9.4 26.05Q9.3 25.6 9.275 25.025Q9.25 24.45 9.25 24Q9.25 23.55 9.275 22.975Q9.3 22.4 9.4 21.95L5.1 18.8Q4.65 18.45 4.5 17.9Q4.35 17.35 4.65 16.85L7.95 11Q8.25 10.45 8.8 10.275Q9.35 10.1 9.9 10.35L14.55 12.5Q15.35 11.85 16.4 11.25Q17.45 10.65 18.4 10.35L19.2 5.25Q19.3 4.7 19.725 4.35Q20.15 4 20.7 4H27.3Q27.85 4 28.275 4.35Q28.7 4.7 28.8 5.25L29.6 10.3Q30.55 10.65 31.625 11.225Q32.7 11.8 33.45 12.5L38.1 10.35Q38.65 10.1 39.2 10.275Q39.75 10.45 40.05 11L43.35 16.8Q43.65 17.3 43.525 17.875Q43.4 18.45 42.9 18.8L38.6 21.85Q38.7 22.35 38.725 22.925Q38.75 23.5 38.75 24Q38.75 24.5 38.725 25.05Q38.7 25.6 38.6 26.1L42.9 29.2Q43.35 29.55 43.5 30.1Q43.65 30.65 43.35 31.15L40.05 37Q39.75 37.55 39.2 37.725Q38.65 37.9 38.1 37.65L33.45 35.5Q32.65 36.15 31.625 36.775Q30.6 37.4 29.6 37.7L28.8 42.75Q28.7 43.3 28.275 43.65Q27.85 44 27.3 44ZM24 30.5Q26.7 30.5 28.6 28.6Q30.5 26.7 30.5 24Q30.5 21.3 28.6 19.4Q26.7 17.5 24 17.5Q21.3 17.5 19.4 19.4Q17.5 21.3 17.5 24Q17.5 26.7 19.4 28.6Q21.3 30.5 24 30.5ZM24 27.5Q22.55 27.5 21.525 26.475Q20.5 25.45 20.5 24Q20.5 22.55 21.525 21.525Q22.55 20.5 24 20.5Q25.45 20.5 26.475 21.525Q27.5 22.55 27.5 24Q27.5 25.45 26.475 26.475Q25.45 27.5 24 27.5ZM24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24ZM21.8 41H26.2L26.9 35.4Q28.55 35 30.025 34.15Q31.5 33.3 32.7 32.1L38 34.4L40 30.8L35.3 27.35Q35.5 26.5 35.625 25.675Q35.75 24.85 35.75 24Q35.75 23.15 35.65 22.325Q35.55 21.5 35.3 20.65L40 17.2L38 13.6L32.7 15.9Q31.55 14.6 30.1 13.725Q28.65 12.85 26.9 12.6L26.2 7H21.8L21.1 12.6Q19.4 12.95 17.925 13.8Q16.45 14.65 15.3 15.9L10 13.6L8 17.2L12.7 20.65Q12.5 21.5 12.375 22.325Q12.25 23.15 12.25 24Q12.25 24.85 12.375 25.675Q12.5 26.5 12.7 27.35L8 30.8L10 34.4L15.3 32.1Q16.5 33.3 17.975 34.15Q19.45 35 21.1 35.4Z' />
        </svg>
      </Icon>
    </Button>
  );
}
