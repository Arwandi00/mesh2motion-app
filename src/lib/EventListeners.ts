import { type Bootstrap } from '../script'
import { ModelPreviewDisplay } from './enums/ModelPreviewDisplay'
import { ProcessStep } from './enums/ProcessStep'
import { Utility } from './Utilities'
import { Object3D } from 'three'

export class EventListeners {
  constructor (private readonly bootstrap: Bootstrap) {}

  public addEventListeners (): void {
    this.bootstrap.renderer.domElement.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.bootstrap.is_transform_controls_dragging) {
        this.bootstrap.handle_transform_controls_moving()
      }

      // edit skeleton step logic that deals with hovering over bones
      if (this.bootstrap.process_step === ProcessStep.EditSkeleton) {
        this.bootstrap.edit_skeleton_step.calculate_bone_hover_effect(event, this.bootstrap.camera)
      }
    })

    this.bootstrap.renderer.domElement.addEventListener('mousedown', (event: MouseEvent) => {
      this.bootstrap.handle_transform_controls_mouse_down(event)

      // update UI with current bone name
      if (this.bootstrap.ui.dom_selected_bone_label !== null &&
        this.bootstrap.edit_skeleton_step.get_currently_selected_bone() !== null) {
        this.bootstrap.ui.dom_selected_bone_label.innerHTML =
          this.bootstrap.edit_skeleton_step.get_currently_selected_bone().name
      }
    }, false)

    this.bootstrap.transform_controls?.addEventListener('dragging-changed', (event: any) => {
      this.bootstrap.is_transform_controls_dragging = event.value
      this.bootstrap.controls.enabled = !event.value
    })

    this.bootstrap.load_model_step.addEventListener('modelLoaded', () => {
      this.bootstrap.process_step = this.bootstrap.process_step_changed(ProcessStep.LoadSkeleton)
    })

    this.bootstrap.load_skeleton_step.addEventListener('skeletonLoaded', () => {
      this.bootstrap.edit_skeleton_step.load_original_armature_from_model(this.bootstrap.load_skeleton_step.armature())
      this.bootstrap.regenerate_skeleton_helper(this.bootstrap.edit_skeleton_step.skeleton())
      this.bootstrap.process_step = this.bootstrap.process_step_changed(ProcessStep.EditSkeleton)
    })

    this.bootstrap.ui.dom_bind_pose_button?.addEventListener('click', () => {
      const passed_bone_skinning_test = this.bootstrap.test_bone_weighting_success()
      if (passed_bone_skinning_test) {
        this.bootstrap.process_step_changed(ProcessStep.BindPose)
      }
    })

    // rotate model after loading it in to orient it correctly
    this.bootstrap.ui.dom_rotate_model_x_button?.addEventListener('click', () => {
      this.bootstrap.load_model_step.rotate_model_by_axis('x', 90)
    })

    this.bootstrap.ui.dom_rotate_model_y_button?.addEventListener('click', () => {
      this.bootstrap.load_model_step.rotate_model_by_axis('y', 90)
    })

    this.bootstrap.ui.dom_rotate_model_z_button?.addEventListener('click', () => {
      this.bootstrap.load_model_step.rotate_model_by_axis('z', 90)
    })

    this.bootstrap.ui.dom_move_model_to_floor_button?.addEventListener('click', () => {
      this.bootstrap.load_model_step.move_model_to_floor()
    })

    this.bootstrap.ui.dom_show_skeleton_checkbox?.addEventListener('click', (event: MouseEvent) => {
      if (this.bootstrap.skeleton_helper !== undefined) {
        this.bootstrap.skeleton_helper.visible = event.target.checked
      } else {
        console.warn('Skeleton helper is undefined, so we cannot show it')
      }
    })

    this.bootstrap.ui.dom_export_button?.addEventListener('click', () => {
      const all_clips = this.bootstrap.animations_listing_step.animation_clips()
      this.bootstrap.file_export_step.set_animation_clips_to_export(all_clips)
      this.bootstrap.file_export_step.export(this.bootstrap.weight_skin_step.final_skinned_meshes(), 'exported-model')
    })

    // going back to edit skeleton step after skinning
    // this will do a lot of resetting
    this.bootstrap.ui.dom_back_to_edit_skeleton_button?.addEventListener('click', () => {
      this.bootstrap.remove_skinned_meshes_from_scene() // clear any existing skinned meshes
      this.bootstrap.debugging_visual_object = Utility.regenerate_debugging_scene(this.bootstrap.scene)
      this.bootstrap.process_step = this.bootstrap.process_step_changed(ProcessStep.EditSkeleton)
      this.bootstrap.regenerate_skeleton_helper(this.bootstrap.edit_skeleton_step.skeleton())
      this.bootstrap.load_model_step.model_meshes().visible = true

      // reset current bone selection for edit skeleton step
      this.bootstrap.edit_skeleton_step.set_currently_selected_bone(null)

      if (this.bootstrap.ui.dom_selected_bone_label !== null) {
        this.bootstrap.ui.dom_selected_bone_label.innerHTML = 'None'
      }
    })

    // change view event listeners when configuring skeleton
    this.bootstrap.ui.dom_view_front_change?.addEventListener('click', () => { this.bootstrap.switchToView('front') })
    this.bootstrap.ui.dom_view_side_change?.addEventListener('click', () => { this.bootstrap.switchToView('side') })
    this.bootstrap.ui.dom_view_top_change?.addEventListener('click', () => { this.bootstrap.switchToView('top') })

    // listen for transform mode changes form edit skeleton step
    // change transform type for controls
    this.bootstrap.ui.dom_transform_translate_button?.addEventListener('click', () => {
      this.bootstrap.transform_controls.setMode('translate')
    })

    this.bootstrap.ui.dom_transform_rotate_button?.addEventListener('click', () => {
      this.bootstrap.transform_controls.setMode('rotate')
    })

    // changing the 3d model preview while editing the skeleton bones
    this.bootstrap.ui.dom_model_preview_textured_button?.addEventListener('click', () => {
      console.log('change teo textured model preview')
      this.bootstrap.changed_model_preview_display(ModelPreviewDisplay.Textured)
    })

    this.bootstrap.ui.dom_model_preview_weight_painted_button?.addEventListener('click', () => {
      this.bootstrap.changed_model_preview_display(ModelPreviewDisplay.WeightPainted)
    })
  }
}
