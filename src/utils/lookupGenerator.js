const generateLookupPipeline = (lookupConfig) => {
  const { from, localField, foreignField, as, pipeline } = lookupConfig;
  const pipelineArray = [];
  for (let i = 0; i < from.length; i++) {
    const lookupStage = {
      $lookup: {
        from: from[i],
        localField: localField[i],
        foreignField: foreignField[i],
        as: as[i],
        pipeline: pipeline[i],
      },
    };
    pipelineArray.push(lookupStage);
    pipelineArray.push({ $unwind: { path: `$${as[i]}`, preserveNullAndEmptyArrays: true } });
  }
  return pipelineArray;
};
module.exports = generateLookupPipeline;
