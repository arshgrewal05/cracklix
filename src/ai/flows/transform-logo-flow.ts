/**
 * @fileOverview A cinematic transformation flow for corporate branding assets.
 * 
 * - transformLogo - function to handle image-to-image environment generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TransformLogoInputSchema = z.object({
  logoDataUri: z
    .string()
    .describe(
      "A photo of the logo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TransformLogoInput = z.infer<typeof TransformLogoInputSchema>;

const TransformLogoOutputSchema = z.object({
  transformedImageDataUri: z.string().describe('The transformed image data URI.'),
});
export type TransformLogoOutput = z.infer<typeof TransformLogoOutputSchema>;

export async function transformLogo(input: TransformLogoInput): Promise<TransformLogoOutput> {
  return transformLogoFlow(input);
}

const transformLogoFlow = ai.defineFlow(
  {
    name: 'transformLogoFlow',
    inputSchema: TransformLogoInputSchema,
    outputSchema: TransformLogoOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      prompt: [
        { media: { url: input.logoDataUri } },
        { 
          text: "Transform this image into a tropical jungle waterfall, keeping the main subject exactly as it appears, with golden sunset light, humid rainy season, peaceful and mystical atmosphere, vibrant green and blue color palette, detailed and coherent background, realistic perspective, high detail, avoid changing the subject's shape, size, or appearance, cinematic composition, ultra-realistic textures, and fully integrated environment. Use the uploaded image as the sole identity reference." 
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('No media returned from the transformation engine.');
    }

    return {
      transformedImageDataUri: media.url,
    };
  }
);
