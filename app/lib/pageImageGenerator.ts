// File: /app/lib/pageImageGenerator.ts v1.7.0
/**
 * 涂色书页面图像的并发生成编排。
 * 从 useBookGenerator 抽离，使主 hook 保持精简、职责单一。
 *
 * 设计要点：
 * - 使用固定大小的工作池（worker pool）控制并发请求数，避免打满速率限制。
 * - 单页失败不丢弃整本书：记录错误并继续生成其余页面。
 * - 通过 onProgress 回调实时上报进度，供 UI 展示生成阶段。
 */
import { generateImage, type StoryScene } from '../services/ai';
import { ColoringBookPage, ImageResolution, ImageAspectRatio, ArtStyle, AiEngine } from '../types';

const NUMBER_OF_PAGES = 5;
const CONCURRENT_REQUESTS = 2;

export interface PageImageConfig {
  theme: string;
  name: string;
  artStyle: ArtStyle;
  resolution: ImageResolution;
  aspectRatio: ImageAspectRatio;
  engine: AiEngine;
  storyMode: boolean;
}

const buildPagePrompt = (
  config: PageImageConfig,
  index: number,
  stories: StoryScene[],
): { prompt: string; story?: string } => {
  if (config.storyMode && stories[index]) {
    return {
      story: stories[index].story,
      prompt: `${stories[index].imagePrompt}. Coloring book page, ${config.artStyle} style, bold black outlines, white background, no shading`,
    };
  }
  return {
    prompt: `${config.theme} for ${config.name}, coloring book page, ${config.artStyle} style, bold black outlines, white background, no shading`,
  };
};

export const generateBookPages = async (
  config: PageImageConfig,
  stories: StoryScene[],
  onProgress: (completed: number) => void,
): Promise<{ pages: ColoringBookPage[]; error?: string }> => {
  const pageConfigs = Array.from({ length: NUMBER_OF_PAGES }, (_, index) => ({
    index,
    ...buildPagePrompt(config, index, stories),
  }));

  const results: (ColoringBookPage | undefined)[] = Array(NUMBER_OF_PAGES);
  const taskQueue = [...pageConfigs];
  let nextIndex = 0;
  const pageErrors: string[] = [];

  const worker = async (): Promise<void> => {
    while (nextIndex < taskQueue.length) {
      const taskIndex = nextIndex++;
      const task = taskQueue[taskIndex];
      try {
        const imageResponse = await generateImage(
          task.prompt,
          config.resolution,
          config.aspectRatio,
          config.artStyle,
          config.engine,
        );
        if (imageResponse.success && imageResponse.data) {
          results[task.index] = {
            pageNumber: task.index + 1,
            imageUrl: imageResponse.data.imageUrl,
            story: task.story,
            prompt: task.prompt,
          };
        } else {
          throw new Error(imageResponse.error ?? imageResponse.message);
        }
      } catch (err) {
        // 单页失败不应丢弃整本书：记录错误并继续生成其余页面
        pageErrors.push(err instanceof Error ? err.message : 'Failed to generate a page');
      }
      onProgress(nextIndex);
    }
  };

  const poolSize = Math.min(CONCURRENT_REQUESTS, pageConfigs.length);
  const workers = Array.from({ length: poolSize }, () => worker());
  await Promise.all(workers);

  const successfulPages = results.filter(Boolean) as ColoringBookPage[];
  return {
    pages: successfulPages,
    error: pageErrors[0],
  };
};
